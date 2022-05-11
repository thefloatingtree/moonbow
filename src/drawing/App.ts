import * as PIXI from 'pixi.js'
import { Canvas } from './Canvas'
import { Viewport } from './Viewport'

export class App {
    ref: HTMLCanvasElement
    application: PIXI.Application 
    canvas: Canvas
    viewport: Viewport

    init(ref: HTMLCanvasElement) {
        this.ref = ref

        PIXI.settings.FILTER_RESOLUTION = 1
        PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.HIGH
        PIXI.settings.MIPMAP_TEXTURES = PIXI.MIPMAP_MODES.ON
        PIXI.settings.WRAP_MODE = PIXI.WRAP_MODES.REPEAT
        PIXI.utils.skipHello()
         
        this.application = new PIXI.Application({ view: this.ref, backgroundColor: 0x333333, resizeTo: window, antialias: true })

        this.canvas = new Canvas()
        this.canvas.setupEvents()

        this.viewport = new Viewport(this.canvas)
        this.viewport.setupEvents()
        
        this.application.stage.addChild(this.viewport.container)
                
        this.application.start()
    }
}

export const app = new App()