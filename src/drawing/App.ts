import * as PIXI from 'pixi.js'
import { OnDownTriggerAction, OnHoldReleaseTriggerAction, OnUpTriggerAction } from './Actions'
import { ActionManager } from './ActionManager'
import { Canvas } from './Canvas'
import { ToolManager } from './ToolManager'
import { Viewport } from './Viewport'

export class App {
    public ref: HTMLCanvasElement
    public application: PIXI.Application
    public canvas: Canvas
    public viewport: Viewport
    public actionManager: ActionManager
    public toolManager: ToolManager

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
        this.actionManager = new ActionManager()
        this.toolManager = new ToolManager()

        this.addActions()
        this.addTools()

        this.application.stage.addChild(this.viewport.container)

        this.application.start()
    }

    addActions() {
        // navigation
        // pan
        this.actionManager.addAction(new OnDownTriggerAction([' '], () => this.toolManager.selectTool('pan')))
        this.actionManager.addAction(new OnUpTriggerAction([' '], () => this.toolManager.selectPreviousTool()))
        // zoom
        this.actionManager.addAction(new OnDownTriggerAction(['z'], () => this.toolManager.selectTool('zoom')))
        this.actionManager.addAction(new OnHoldReleaseTriggerAction(['z'], () => this.toolManager.selectPreviousTool()))
        // rotate
        this.actionManager.addAction(new OnUpTriggerAction(['ArrowLeft'], () => this.viewport.rotateLeft()))
        this.actionManager.addAction(new OnUpTriggerAction(['ArrowRight'], () => this.viewport.rotateRight()))
        // tools
        this.actionManager.addAction(new OnUpTriggerAction(['b'], () => this.toolManager.selectTool('brush')))
        this.actionManager.addAction(new OnUpTriggerAction(['e'], () => this.toolManager.selectTool('eraser')))
    }

    addTools() {

        // navigation

        this.toolManager.addTool('pan')
            .onMouseMove((e) => {
                if (e.buttons) {
                    app.viewport.pan(e)
                }
            })
        this.toolManager.addTool('zoom')
            .onMouseMove((e) => {
                if (e.buttons) {
                    app.viewport.zoom(e)
                }
            })


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

        this.toolManager.selectTool('brush')
    }
}

export const app = new App()