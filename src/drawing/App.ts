import * as PIXI from 'pixi.js'
import { Action } from './Action'
import { ActionManager } from './ActionManager'
import { Canvas } from './Canvas'
import { ToolManager } from './ToolManager'
import { Viewport } from './Viewport'

export class App {
    ref: HTMLCanvasElement
    application: PIXI.Application
    canvas: Canvas
    viewport: Viewport
    actionManager: ActionManager
    toolManager: ToolManager

    init(ref: HTMLCanvasElement) {
        this.ref = ref

        PIXI.settings.FILTER_RESOLUTION = 1
        PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.HIGH
        PIXI.settings.MIPMAP_TEXTURES = PIXI.MIPMAP_MODES.ON
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR
        PIXI.settings.WRAP_MODE = PIXI.WRAP_MODES.REPEAT
        PIXI.utils.skipHello()

        this.application = new PIXI.Application({ view: this.ref, backgroundColor: 0x333333, resizeTo: window, antialias: true })

        this.canvas = new Canvas()

        this.viewport = new Viewport(this.canvas)
        this.viewport.setupEvents()

        this.application.stage.addChild(this.viewport.container)

        this.actionManager = new ActionManager()
        this.toolManager = new ToolManager()

        this.addActions()
        this.addTools()

        this.application.start()
    }

    addActions() {
        this.actionManager.addAction(new Action(['b'], () => this.toolManager.selectTool('brush')))
        this.actionManager.addAction(new Action(['e'], () => this.toolManager.selectTool('eraser')))
    }

    addTools() {
        this.toolManager.addTool('brush')
            .onActivate(() => {
                console.log("Brush")
            })
            .onMouseDown((e: PointerEvent) => {
                app.canvas.startBrushStroke(e)
            })
            .onMouseMove((e: PointerEvent) => {
                app.canvas.updateBrushStroke(e)
            })
            .onMouseUp((e: PointerEvent) => {
                app.canvas.endBrushStroke(e)
            })
        this.toolManager.addTool('eraser')
            .onActivate(() => {
                console.log("Eraser")
            })
    }
}

export const app = new App()