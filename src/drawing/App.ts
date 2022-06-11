import * as PIXI from 'pixi.js'
import { OnDownTriggerAction, OnHoldReleaseTriggerAction, OnUpTriggerAction } from './Actions/Actions'
import { ActionManager } from './Actions/ActionManager'
import { Canvas } from './Canvas/Canvas'
import { ToolManager } from './Tools/ToolManager'
import { Viewport } from './Viewport'
import { ToolType } from './Tools/ToolTypes'
import { RenderTexturePool } from './Canvas/RenderTexturePool'

export class App {
    public ref: HTMLCanvasElement
    public application: PIXI.Application
    public canvas: Canvas
    public viewport: Viewport
    public actionManager: ActionManager
    public toolManager: ToolManager
    public renderTexturePool: RenderTexturePool

    private afterInitCallbacks: Array<Function> = []

    init(ref: HTMLCanvasElement) {
        this.ref = ref

        PIXI.settings.FILTER_RESOLUTION = 1
        PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.HIGH
        PIXI.settings.MIPMAP_TEXTURES = PIXI.MIPMAP_MODES.ON
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR
        PIXI.settings.WRAP_MODE = PIXI.WRAP_MODES.REPEAT
        PIXI.utils.skipHello()

        this.application = new PIXI.Application({ view: this.ref, backgroundColor: 0x3E3E46, resizeTo: window, antialias: true })

        this.renderTexturePool = new RenderTexturePool()
        this.canvas = new Canvas()
        this.viewport = new Viewport(this.canvas)
        this.actionManager = new ActionManager()
        this.toolManager = new ToolManager()

        this.addActions()
        this.addTools()

        this.application.stage.addChild(this.viewport.container)

        this.application.start()

        this.afterInitCallbacks.forEach(fn => fn())
    }

    onAfterInit(fn: Function) {
        this.afterInitCallbacks.push(fn)
    }

    private addActions() {
        // navigation
        // pan
        this.actionManager.addAction(new OnDownTriggerAction([' '], () => this.toolManager.selectTool(ToolType.Pan)))
        this.actionManager.addAction(new OnUpTriggerAction([' '], () => this.toolManager.selectPreviousTool()))
        this.actionManager.addAction(new OnDownTriggerAction(['mousemiddle'], () => this.toolManager.selectTool(ToolType.Pan)))
        this.actionManager.addAction(new OnUpTriggerAction(['mousemiddle'], () => this.toolManager.selectPreviousTool()))

        // zoom
        this.actionManager.addAction(new OnDownTriggerAction(['z'], () => this.toolManager.selectTool(ToolType.Zoom)))
        this.actionManager.addAction(new OnHoldReleaseTriggerAction(['z'], () => this.toolManager.selectPreviousTool()))
        // rotate
        this.actionManager.addAction(new OnDownTriggerAction(['r'], () => this.toolManager.selectTool(ToolType.Rotate)))
        this.actionManager.addAction(new OnHoldReleaseTriggerAction(['r'], () => this.toolManager.selectPreviousTool()))
        this.actionManager.addAction(new OnDownTriggerAction(['arrowleft'], () => this.viewport.rotateLeft()))
        this.actionManager.addAction(new OnDownTriggerAction(['arrowright'], () => this.viewport.rotateRight()))
        // tools
        this.actionManager.addAction(new OnUpTriggerAction(['b'], () => this.toolManager.selectTool(ToolType.Brush)))
        this.actionManager.addAction(new OnUpTriggerAction(['e'], () => this.toolManager.selectTool(ToolType.Eraser)))
        // undo/redo
        // this.actionManager.addAction(new OnUpTriggerAction(['control', 'z'], () => this.canvas.undo()))
        // this.actionManager.addAction(new OnUpTriggerAction(['control', 'y'], () => this.canvas.redo()))
        // this.actionManager.addAction(new OnUpTriggerAction(['control', 'shift', 'z'], () => this.canvas.redo()))
    }

    private addTools() {

        // navigation
        this.toolManager.addTool(ToolType.Pan)
            .onMouseMove((e) => {
                if (e.buttons) {
                    app.viewport.pan(e)
                }
            })
        this.toolManager.addTool(ToolType.Zoom)
            .onMouseDown((e) => {
                app.viewport.scrubbyZoomStart(e)
            })
            .onMouseMove((e) => {
                if (e.buttons) {
                    app.viewport.scrubbyZoomUpdate(e)
                }
            })
            .onMouseUp((e) => {
                app.viewport.scrubbyZoomEnd(e)
            })

        this.toolManager.addTool(ToolType.WheelZoom, true)
            .onWheel((e: WheelEvent) => {
                app.viewport.wheelZoom(e)
            })
        this.toolManager.addTool(ToolType.Rotate)
            .onMouseDown((e) => {
                app.viewport.scrubbyRotateStart(e)
            })
            .onMouseMove((e) => {
                if (e.buttons) {
                    app.viewport.scrubbyRotateUpdate(e)
                }
            })
            .onMouseUp((e) => {
                app.viewport.scrubbyRotateEnd(e)
            })

        // painting
        this.toolManager.addTool(ToolType.Brush)
            .onMouseDown((e: PointerEvent) => {
                if (e.button === 0) app.canvas.startBrushStroke(e)
            })
            .onMouseMove((e: PointerEvent) => {
                app.canvas.updateBrushStroke(e)
            }) 
            .onMouseUp((e: PointerEvent) => {
                if (e.button === 0) app.canvas.endBrushStroke(e)
            })
        this.toolManager.addTool(ToolType.Eraser)
            .onMouseDown((e: PointerEvent) => {
                if (e.button === 0) app.canvas.startBrushStroke(e, true)
            })
            .onMouseMove((e: PointerEvent) => {
                app.canvas.updateBrushStroke(e, true)
            }) 
            .onMouseUp((e: PointerEvent) => {
                if (e.button === 0) app.canvas.endBrushStroke(e, true)
            })

        this.toolManager.selectTool(ToolType.Brush)
    }
}

export const app = new App()