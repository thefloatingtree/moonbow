import { app } from "./App"
import { MessageTypes } from '../../server/MessageTypes'
import { RemoteArtist } from "./Artist/RemoteArtist";
import { LocalArtist } from "./Artist/LocalArtist";

type MessageType = typeof MessageTypes[keyof typeof MessageTypes];

export class Connection {

    public ws: WebSocket = null

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
                        app.artistManager.addArtist(new RemoteArtist(message.body.id, message.body.color))
                        break
                    case MessageTypes.OnClientDisconected:
                        app.artistManager.removeArtist(message.body)
                        break
                    case MessageTypes.GetCurrentState:
                        app.artistManager.addArtists(message.body.clients.map(artistData => new RemoteArtist(artistData.id, artistData.color)))
                        break
                    case MessageTypes.OnSelfConnected:
                        // TODO: make URL work on production too, not just localhost
                        this.joinURL = "http://localhost:3000/?room=" + message.body.roomId
                        app.localArtist.id = message.body.id
                        app.localArtist.color = message.body.color
                        app.artistManager.addArtist(new LocalArtist(message.body.id, message.body.color))
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