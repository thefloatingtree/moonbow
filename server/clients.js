export const clients = new Map()

export function addClientToRoom(roomId, client) {
    if (!clients.get(roomId)) clients.set(roomId, [])
    clients.get(roomId).push(client)
}

export function getOwnerFromRoom(roomId) {
    if (!clients.get(roomId)) return null
    return clients.get(roomId).find(client => client.owner === true)
}

export function getClientFromRoom(roomId, clientId) {
    if (!clients.get(roomId)) return null
    return clients.get(roomId).find(client => client.id === clientId)
}