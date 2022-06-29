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
import { EventType } from './Tools/Tool'
import { LocalArtist } from './Artist/LocalArtist'

export class App {
    public ref: HTMLCanvasElement
    public application: PIXI.Application
    public canvas: Canvas
    public viewport: Viewport
    public renderTexturePool: RenderTexturePool
    public brushManager: BrushManager
    public connection: Connection
    public artistManager: ArtistManager

    public localArtist: LocalArtist

    private afterInitCallbacks: Array<Function> = []

    init(ref: HTMLCanvasElement) {
        this.ref = ref

        this.configurePIXI()

        this.application = new PIXI.Application({ view: this.ref, backgroundColor: 0x3E3E46, resizeTo: window, antialias: true })

        this.renderTexturePool = new RenderTexturePool()
        this.canvas = new Canvas()
        this.viewport = new Viewport(this.canvas)
        this.brushManager = new BrushManager()

        this.artistManager = new ArtistManager()
        this.connection = new Connection()

        this.localArtist = new LocalArtist("test", "#FFFFFF")

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