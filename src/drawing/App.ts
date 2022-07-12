import * as PIXI from 'pixi.js'
import { Canvas } from './Canvas/Canvas'
import { Viewport } from './Viewport'
import { RenderTexturePool } from './Util/RenderTexturePool'
import { brushColor, brushHardness, brushOpacity, brushSettings, brushSize, brushSpacing, brushTipType, brushUseOpacityPressure, brushUseSizePressure } from '../lib/stores/brushSettings'
import { colorPickerStore } from '../lib/stores/colorPicker'
import { BrushManager } from './Brush/BrushManager'
import { eraserHardness, eraserOpacity, eraserSettings, eraserSize, eraserSpacing, eraserTipType, eraserUseOpacityPressure, eraserUseSizePressure } from '../lib/stores/eraserSettings'
import { Connection } from './Connection'
import { ArtistManager } from './Artist/ArtistManager'
import { DropShadowFilter } from 'pixi-filters';
import { Grid } from './Grid'

export class App {
    public ref: HTMLCanvasElement
    public application: PIXI.Application
    public canvas: Canvas
    public viewport: Viewport
    public grid: Grid
    public renderTexturePool: RenderTexturePool
    public brushManager: BrushManager
    public connection: Connection
    public artistManager: ArtistManager

    private afterInitCallbacks: Array<Function> = []

    init(ref: HTMLCanvasElement) {
        this.ref = ref

        this.configurePIXI()

        this.application = new PIXI.Application({ view: this.ref, backgroundColor: 0x252525, resizeTo: window, antialias: true })

        this.renderTexturePool = new RenderTexturePool()
        this.canvas = new Canvas()
        this.viewport = new Viewport(this.canvas)
        this.grid = new Grid()

        this.application.stage.addChild(this.grid.container)
        this.application.stage.addChild(this.viewport.container)

        this.brushManager = new BrushManager()
        this.artistManager = new ArtistManager()
        this.connection = new Connection()

        this.artistManager.addListeners()
        this.connection.connect()

        this.addUIIntegrations()

        this.application.start()

        this.application.renderer.plugins.interaction.cursorStyles.default = 'none'
        this.application.renderer.plugins.interaction.setCursorMode('none')

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
        colorPickerStore.set({ hex: app.canvas.defaultBrushSettings.color })

        brushColor.set(app.canvas.defaultBrushSettings.color)
        brushOpacity.set(app.canvas.defaultBrushSettings.opacity)
        brushSize.set(app.canvas.defaultBrushSettings.size)
        brushHardness.set(app.canvas.defaultBrushSettings.hardness)
        brushSpacing.set(app.canvas.defaultBrushSettings.spacing)
        brushTipType.set(app.canvas.defaultBrushSettings.tipType)
        brushUseSizePressure.set(app.canvas.defaultBrushSettings.useSizePressure)
        brushUseOpacityPressure.set(app.canvas.defaultBrushSettings.useOpacityPressure)

        brushSettings.subscribe((brushSettings) => app.artistManager.localArtist.changeBrushSettings(brushSettings))

        eraserOpacity.set(app.canvas.defaultEraserSettings.opacity)
        eraserSize.set(app.canvas.defaultEraserSettings.size)
        eraserHardness.set(app.canvas.defaultEraserSettings.hardness)
        eraserSpacing.set(app.canvas.defaultEraserSettings.spacing)
        eraserTipType.set(app.canvas.defaultEraserSettings.tipType)
        eraserUseSizePressure.set(app.canvas.defaultEraserSettings.useSizePressure)
        eraserUseOpacityPressure.set(app.canvas.defaultEraserSettings.useOpacityPressure)

        eraserSettings.subscribe((eraserSettings) => app.artistManager.localArtist.changeEraserSettings(eraserSettings))
    }
}

export const app = new App()