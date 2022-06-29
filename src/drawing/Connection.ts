import { app } from "./App"
import { MessageTypes } from '../../server/MessageTypes'

type MessageType = typeof MessageTypes[keyof typeof MessageTypes];

export class Connection {

    public ws: WebSocket = null

    public userInfo
    public joinURL = ""

    private getRoomCode() {
        const urlParams = new URLSearchParams(window.location.search)
        return urlParams.get('room')
    }

    connect() {
        this.ws = new WebSocket("ws://localhost:9001/")
        this.ws.onopen = event => {
            this.ws.onmessage = event => {
                const message = JSON.parse(event.data)
                switch (message.type) {
                    case MessageTypes.OnClientConnected:
                        app.artistManager.addArtist(message.body)
                        break
                    case MessageTypes.OnClientDisconected:
                        app.artistManager.removeArtist(message.body)
                        break
                    case MessageTypes.GetCurrentState:
                        app.artistManager.addArtists(message.body.clients)
                        break
                    case MessageTypes.OnSelfConnected:
                        // TODO: make URL work on production too, not just localhost
                        this.joinURL = "http://localhost:3000/?room=" + message.body.roomId
                        this.userInfo = message.body
                    default:
                        console.log(message)
                }
            }

            // TODO: move this somewhere else, join/create room screen
            this.ws.send(JSON.stringify({ type: MessageTypes.JoinRoom, body: { roomId: this.getRoomCode() } }))
        }
    }

    disconnect() {
        this.ws.close()
        this.ws = null
    }

    sendMessage(type: MessageType, message: Object) {
        this.ws.send(JSON.stringify({ type, body: message }))
    }
}