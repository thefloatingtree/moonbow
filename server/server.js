import { App } from 'uWebSockets.js'
import { onClientDisconnect, onClientMessage } from './actions.js'
import { serveDir } from 'uwebsocket-serve';
import path from 'path'

export const rooms = new Map()
const PORT = process.env.PORT || 5000

const publicPath = path.resolve('./dist')
const serveStatic = serveDir(publicPath)

export const app = App()
    .ws('/*', {
        message: onClientMessage,
        close: onClientDisconnect,
    })
    .get("/*", serveStatic)
    .listen('0.0.0.0', PORT, (listenSocket) => {
        if (listenSocket) {
            console.log(`Listening on port ${PORT}`);
        }
    })
