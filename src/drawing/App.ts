import * as PIXI from 'pixi.js'
import { OnDownTriggerAction, OnHoldReleaseTriggerAction, OnUpTriggerAction } from './Actions/Actions'
import { ActionManager } from './Actions/ActionManager'
import { Canvas } from './Canvas/Canvas'
import { ToolManager } from './Tools/ToolManager'
import { Viewport } from './Viewport'
import { ToolType } from './Tools/ToolTypes'
import { RenderTexturePool } from './Util/RenderTexturePool'
import { brushColor, brushHardness, brushOpacity, brushSize, brushSpacing, brushTipType } from '../lib/stores/brushSettings'
import { colorPickerStore } from '../lib/stores/colorPicker'
import { BrushManager } from './Brush/BrushManager'
import { eraserHardness, eraserOpacity, eraserSize, eraserSpacing, eraserTipType } from '../lib/stores/eraserSettings'
import { Connection } from './Connection'
import { ArtistManager } from './Artist/ArtistManager'

export class App {
    public ref: HTMLCanvasElement
    public application: PIXI.Application
    public canvas: Canvas
    public viewport: Viewport
    public actionManager: ActionManager
    public toolManager: ToolManager
    public renderTexturePool: RenderTexturePool
    public brushManager: BrushManager
    public connection: Connection
    public artistManager: ArtistManager

    private afterInitCallbacks: Array<Function> = []

    init(ref: HTMLCanvasElement) {
        this.ref = ref

        this.configurePIXI()

        this.application = new PIXI.Application({ view: this.ref, backgroundColor: 0x3E3E46, resizeTo: window, antialias: true })

        this.renderTexturePool = new RenderTexturePool()
        this.canvas = new Canvas()
        this.viewport = new Viewport(this.canvas)
        this.actionManager = new ActionManager()
        this.toolManager = new ToolManager()
        this.brushManager = new BrushManager()
        this.connection = new Connection()
        this.artistManager = new ArtistManager()

        this.addActions()
        this.addTools()
        this.addUIIntegrations()

        this.connection.connect()

        this.application.stage.addChild(this.viewport.container)
        this.application.start()

        this.afterInitCallbacks.forEach(fn => fn())
    }

    onAfterInit(fn: Function) {
        this.afterInitCallbacks.push(fn)
    }

    private configurePIXI() {
        PIXI.settings.FILTER_RESOLUTION = 1
        PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.HIGH
        PIXI.settings.MIPMAP_TEXTURES = PIXI.MIPMAP_MODES.ON
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
        PIXI.settings.WRAP_MODE = PIXI.WRAP_MODES.REPEAT
        PIXI.utils.skipHello()
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
        this.actionManager.addAction(new OnDownTriggerAction(['alt'], () => this.toolManager.selectTool(ToolType.Eyedropper)))
        this.actionManager.addAction(new OnUpTriggerAction(['alt'], () => this.toolManager.selectPreviousTool()))
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

        // other tools
        this.toolManager.addTool(ToolType.Eyedropper)
            .onMouseUp(e => {
                const hex = app.viewport.colorAt(e)
                brushColor.set(hex)
            })

        this.toolManager.selectTool(ToolType.Brush)
    }

    private addUIIntegrations() {
        colorPickerStore.set({ hex: app.canvas.brushSettings.color })

        brushColor.set(app.canvas.brushSettings.color)
        brushOpacity.set(app.canvas.brushSettings.opacity)
        brushSize.set(app.canvas.brushSettings.size)
        brushHardness.set(app.canvas.brushSettings.hardness)
        brushSpacing.set(app.canvas.brushSettings.spacing)
        brushTipType.set(app.canvas.brushSettings.tipType)

        brushColor.subscribe((color) => (app.canvas.brushSettings.color = color))
        brushOpacity.subscribe((opacity) => (app.canvas.brushSettings.opacity = opacity))
        brushSize.subscribe((size) => (app.canvas.brushSettings.size = size))
        brushHardness.subscribe((hardness) => (app.canvas.brushSettings.hardness = hardness))
        brushSpacing.subscribe((spacing) => (app.canvas.brushSettings.spacing = spacing))
        brushTipType.subscribe((tipType) => (app.canvas.brushSettings.tipType = tipType))

        eraserOpacity.set(app.canvas.eraserSettings.opacity)
        eraserSize.set(app.canvas.eraserSettings.size)
        eraserHardness.set(app.canvas.eraserSettings.hardness)
        eraserSpacing.set(app.canvas.eraserSettings.spacing)
        eraserTipType.set(app.canvas.eraserSettings.tipType)

        eraserOpacity.subscribe((opacity) => (app.canvas.eraserSettings.opacity = opacity))
        eraserSize.subscribe((size) => (app.canvas.eraserSettings.size = size))
        eraserHardness.subscribe((hardness) => (app.canvas.eraserSettings.hardness = hardness))
        eraserSpacing.subscribe((spacing) => (app.canvas.eraserSettings.spacing = spacing))
        eraserTipType.subscribe((tipType) => (app.canvas.eraserSettings.tipType = tipType))
    }
}

export const app = new App()