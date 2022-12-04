import { MessageTypes } from '../../server/MessageTypes';
import { app } from './App';

type MessageType = typeof MessageTypes[keyof typeof MessageTypes];

type Message = { type: MessageType, body: any }
type Listener = (message: Message) => void

export class Connection {

    public ws: WebSocket = null
    public joinURL = ""

    // public websocketURL = 'ws://localhost:5000'
    public websocketURL = window.location.href.replace(window.location.protocol, 'wss:')

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
                    window.history.pushState("", "", `/?room=${message.body.roomId}`)
                    this.startPingLoop()
                }

                if (message.type === MessageTypes.GetOwnerState) {
                    const data = app.serialize()
                    this.sendMessage(MessageTypes.GetOwnerState, { 
                        recipientId: message.body.id, 
                        roomId: message.body.roomId, 
                        data 
                    })
                }

                this.listeners.forEach(listener => listener(message))
            }

            // TODO: move this somewhere else, join/create room screen
            this.ws.send(JSON.stringify({ type: MessageTypes.JoinRoom, body: { roomId: this.getRoomCode(), name: JSON.parse(localStorage.getItem('username')) } }))
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

    private startPingLoop() {
        setInterval(() => {
            this.sendMessage(MessageTypes.Ping, {})
        }, 1000 * 100) // Default uWebsockets.js socket timeout is 120 seconds
    }

    private getRoomCode() {
        const urlParams = new URLSearchParams(window.location.search)
        return urlParams.get('room')
    }
}