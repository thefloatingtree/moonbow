import { app } from "./App"
import { MessageTypes } from '../../server/MessageTypes'
import { RemoteArtist } from "./Artist/RemoteArtist";
import { LocalArtist } from "./Artist/LocalArtist";

type MessageType = typeof MessageTypes[keyof typeof MessageTypes];

type Message = { type: MessageType, body: any }
type Listener = (message: Message) => void

export class Connection {

    public ws: WebSocket = null
    public joinURL = ""

    public websocketURL = 'ws://localhost:5000'
    // public websocketURL = window.location.href.replace(window.location.protocol, 'ws:')
    
    private listeners: Array<Listener> = []

    public addMessageListener(listener: Listener) {
        this.listeners.push(listener)
    }

    public removeMessageListener(listener: Listener) {
        this.listeners = this.listeners.filter(l => l !== listener)
    }

    public connect() {
        this.ws = new WebSocket(this.websocketURL)
        this.ws.onopen = event => {
            this.ws.onmessage = event => {
                const message = JSON.parse(event.data) as Message

                if (message.type === MessageTypes.OnSelfConnected) {
                    this.joinURL = `${window.location.origin}/?room=${message.body.roomId}`
                }

                this.listeners.forEach(listener => listener(message))
            }

            // TODO: move this somewhere else, join/create room screen
            this.ws.send(JSON.stringify({ type: MessageTypes.JoinRoom, body: { roomId: this.getRoomCode() } }))
        }
    }

    public disconnect() {
        this.ws.close()
        this.ws = null
    }

    public sendMessage(type: MessageType, message: Object) {
        if (this.ws.readyState === this.ws.OPEN)
            this.ws.send(JSON.stringify({ type, body: message }))
    }

    private getRoomCode() {
        const urlParams = new URLSearchParams(window.location.search)
        return urlParams.get('room')
    }
}