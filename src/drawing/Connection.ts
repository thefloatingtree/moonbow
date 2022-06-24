import { app } from "./App"

export const MessageTypes = Object.freeze({
    SelfConnected: "SELF_CONNECTED",
    ClientConnected: "CLIENT_CONNECTED",
    ClientDisconected: "CLIENT_DISCONNECTED",
    ClientMessage: "CLIENT_MESSAGE",
    CurrentState: "CURRENT_STATE"
})

export class Connection {

    public ws: WebSocket = null

    connect() {
        this.ws = new WebSocket("ws://localhost:9001/")
        this.ws.onopen = event => {
            this.ws.onmessage = event => {
                const message = JSON.parse(event.data)
                switch (message.type) {
                    case MessageTypes.ClientConnected:
                        app.artistManager.addArtist(message.body)
                        break
                    case MessageTypes.ClientDisconected:
                        app.artistManager.removeArtist(message.body)
                        break
                    case MessageTypes.CurrentState:
                        app.artistManager.addArtists(message.body.clients)
                        break
                    default:
                        console.log(message)
                }
            }

            this.ws.send(JSON.stringify({ type: MessageTypes.CurrentState }))
        }
    }

    disconnect() {
        this.ws.close()
        this.ws = null
    }
}