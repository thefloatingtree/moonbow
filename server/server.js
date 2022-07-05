import { App } from 'uWebSockets.js'
import { onClientDisconnect, onClientMessage } from './actions.js'
import { serveDir } from 'uwebsocket-serve';
import path from 'path'

export const rooms = new Map()
const PORT = 5000

const publicPath = path.resolve('./dist');
console.log(publicPath)
const serveStatic = serveDir(publicPath);

export const app = App()
    .ws('/*', {
        message: onClientMessage,
        close: onClientDisconnect
    })
    .get("/*", serveStatic)
    .listen(PORT, (listenSocket) => {
        if (listenSocket) {
            console.log(`Listening on port ${PORT}`);
        }
    })
