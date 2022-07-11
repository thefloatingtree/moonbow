import { v4 as uuid } from 'uuid'
import { MessageTypes } from './MessageTypes.js'
import { app, rooms } from './server.js'
import { colors } from './colors.js'
import { names } from './names.js'

export function socketNotInRoom(socket) {
    return !socket.roomId
}

export function onClientMessage(ws, message) {
    const data = JSON.parse(Buffer.from(message).toString())
    switch (data.type) {
        case MessageTypes.JoinRoom:
            connectToRoom(data, ws)
            break
        case MessageTypes.GetCurrentState:
            sendCurrentState(ws)
            break
        case MessageTypes.Ping:
            console.log("ping from " + ws.id)
            break
        default:
            rebroadcast(data, ws)
    }
}

export function onClientDisconnect(ws) {

    if (socketNotInRoom(ws)) return

    const roomId = ws.roomId
    const room = rooms.get(roomId)
    rooms.set(roomId, room.filter(socket => socket.id !== ws.id))

    let ownerId = null

    if (ws.owner) {
        ws.owner = false

        const newOwner = rooms.get(roomId).find(socket => socket.owner !== true)

        if (newOwner) {
            newOwner.owner = true
            ownerId = newOwner.id
        } else {
            rooms.delete(roomId)
        }
    }

    app.publish(`${roomId}/${MessageTypes.OnClientDisconected}`, JSON.stringify({
        type: MessageTypes.OnClientDisconected,
        body: {
            id: ws.id,
            color: ws.color,
            name: ws.name,
            owner: ws.owner,
            ownerId,
        }
    }))
}

export function rebroadcast(data, ws) {
    if (socketNotInRoom(ws)) return

    app.publish(`${ws.roomId}/${MessageTypes.OnClientMessage}`, JSON.stringify({
        type: data.type,
        body: {
            client: {
                id: ws.id,
                roomId: ws.roomId,
            },
            event: data.body
        }
    }))
}

export function sendClientEvent(data, ws) {
    if (socketNotInRoom(ws)) return

    app.publish(`${ws.roomId}/${MessageTypes.OnClientMessage}`, JSON.stringify({
        type: MessageTypes.OnClientEvent,
        body: {
            client: {
                id: ws.id,
                roomId: ws.roomId,
            },
            event: data.body
        }
    }))
}

export function sendCurrentState(ws) {

    if (socketNotInRoom(ws)) return

    const room = rooms.get(ws.roomId)
    ws.send(JSON.stringify({
        type: MessageTypes.GetCurrentState,
        body: {
            clients: room.map(socket => {
                return {
                    id: socket.id,
                    roomId: socket.roomId,
                    name: socket.name,
                    owner: socket.owner,
                    color: socket.color,
                }
            })
        }
    }))
}

export function connectToRoom(data, ws) {

    // Joining an existing room if roomId is provided and exists
    const isJoining = !!data.body?.roomId && rooms.get(data.body.roomId)
    const roomId = isJoining ? data.body.roomId : uuid()

    
    if (isJoining) {
        // Join pre existing room
        const room = rooms.get(data.body.roomId)
        rooms.set(roomId, [...room, ws])
        ws.owner = false
    } else {
        // Create a new room
        rooms.set(roomId, [ws])
        ws.owner = true
    }
    
    const room = rooms.get(roomId)
    
    const name = !!data.body?.name ? data.body.name : names[room.length]
    
    ws.roomId = roomId
    ws.id = uuid()
    ws.color = colors[room.length]
    ws.name = name

    ws.subscribe(`${roomId}/${MessageTypes.OnClientConnected}`)
    ws.subscribe(`${roomId}/${MessageTypes.OnClientDisconected}`)
    ws.subscribe(`${roomId}/${MessageTypes.OnClientMessage}`)

    app.publish(`${roomId}/${MessageTypes.OnClientConnected}`, JSON.stringify({
        type: MessageTypes.OnClientConnected,
        body: {
            id: ws.id,
            roomId: ws.roomId,
            name: ws.name,
            owner: ws.owner,
            color: ws.color,
        }
    }))

    ws.send(JSON.stringify({
        type: MessageTypes.OnSelfConnected,
        body: {
            id: ws.id,
            roomId: ws.roomId,
            name: ws.name,
            owner: ws.owner,
            color: ws.color,
        }
    }))

    sendCurrentState(ws)
}
