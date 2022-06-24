import { App } from 'uWebSockets.js'
import { v4 as uuid } from 'uuid'

const MessageTypes = Object.freeze({
    SelfConnected: "SELF_CONNECTED",
    ClientConnected: "CLIENT_CONNECTED",
    ClientDisconected: "CLIENT_DISCONNECTED",
    ClientMessage: "CLIENT_MESSAGE",
    CurrentState: "CURRENT_STATE"
})

const colors = ["#f94144", "#f3722c", "#f8961e", "#f9844a", "#f9c74f", "#90be6d", "#43aa8b", "#4d908e", "#577590", "#277da1"]
const sockets = []

const app = App()
    .ws('/*', {
        idleTimeout: 32,
        maxBackpressure: 1024,
        maxPayloadLength: 512,
        open: (ws) => {

            ws.id = uuid()
            ws.color = colors[sockets.length]

            ws.subscribe(MessageTypes.ClientConnected);
            ws.subscribe(MessageTypes.ClientDisconected);
            ws.subscribe(MessageTypes.ClientMessage);

            sockets.push(ws)

            const selfMessage = {
                type: MessageTypes.SelfConnected,
                body: {
                    id: ws.id,
                    color: ws.color
                }
            }

            const publicMessage = {
                type: MessageTypes.ClientConnected,
                body: {
                    id: ws.id,
                    color: ws.color
                }
            }

            // send to connecting socket only
            ws.send(JSON.stringify(selfMessage));

            // send to *all* subscribed sockets
            app.publish(MessageTypes.ClientConnected, JSON.stringify(publicMessage))
        },

        /* For brevity we skip the other events (upgrade, open, ping, pong, close) */
        message: (ws, message, isBinary) => {
            const data = JSON.parse(Buffer.from(message).toString())
            switch (data.type) {
                case MessageTypes.CurrentState:
                    ws.send(JSON.stringify({
                        type: MessageTypes.CurrentState,
                        body: {
                            clients: sockets.map(socket => {
                                return {
                                    id: socket.id,
                                    color: socket.color
                                }
                            })
                        }
                    }))
                    break
                default:
                    console.log(data)
            }
        },

        close: (ws) => {
            sockets.find((socket, index) => {
                if (socket && socket.id === ws.id) {
                    sockets.splice(index, 1);
                }
            });

            const publicMessage = {
                type: MessageTypes.ClientDisconected,
                body: {
                    id: ws.id,
                    color: ws.color
                }
            }

            app.publish(MessageTypes.ClientDisconected, JSON.stringify(publicMessage))
        }

    })
    .get('/*', (res, req) => {
        res.writeStatus('200 OK').writeHeader('IsExample', 'Yes').end('Hello there!');
    })
    .listen(9001, (listenSocket) => {
        if (listenSocket) {
            console.log('Listening to port 9001');
        }
    })