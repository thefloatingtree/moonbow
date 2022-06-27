import { App } from 'uWebSockets.js'
import { onClientDisconnect, onClientMessage } from './actions.js'

export const rooms = new Map()
const PORT = 9001

export const app = App()
    .ws('/*', {
        message: onClientMessage,
        close: onClientDisconnect
    })
    .listen(PORT, (listenSocket) => {
        if (listenSocket) {
            console.log(`Listening on port ${PORT}`);
        }
    })
