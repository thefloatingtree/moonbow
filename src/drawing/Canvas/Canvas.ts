import * as PIXI from 'pixi.js'
import type { BrushSettings } from 'src/models/BrushSettings'
import { handle_promise } from 'svelte/internal'
import { app } from '../App'
import type { Artist } from '../Artist/Artist'
import type { Brush } from '../Brush/Brush'
import { BrushStroke } from '../Brush/BrushStroke'
import { Layer } from './Layer'


export class Canvas {
    public container: PIXI.Container = new PIXI.Container()
    public settings = {
        width: 1000,
        height: 1000,
        backgroundColor: 0xFFFFFF,
    }

    public brushSettings: BrushSettings = {
        color: "#03B3FF",
        opacity: 1,
        size: 10,
        spacing: 2,
        tipType: 'circle',
        hardness: 2
    }

    public eraserSettings: BrushSettings = {
        color: "#FFFFFF",
        opacity: 1,
        size: 10,
        spacing: 2,
        tipType: 'circle',
        hardness: 2
    }


    private liveBrushStrokes: Map<string, { brushStroke: BrushStroke, pointerDown: Boolean }> = new Map()

    private liveBrushStroke: BrushStroke
    private pointerDown: boolean

    private activeLayer: Layer

    // private undoStack: Array<PIXI.Sprite> = []
    // private redoStack: Array<PIXI.Sprite> = []

    constructor() {
        const background = new PIXI.Graphics()
            .beginFill(this.settings.backgroundColor)
            .drawRect(0, 0, this.settings.width, this.settings.height)
            .endFill()
        this.container.addChild(background)

        this.activeLayer = new Layer(this)
        this.container.addChild(this.activeLayer.container)
    }

    // undo() {
    //     if (this.undoStack.length <= 1) return

    //     const currentCanvasSprite = this.undoStack.pop()
    //     this.redoStack.push(currentCanvasSprite)

    //     this.container.removeChildren()
    //     this.container.addChild(this.eraseMask)
    //     this.container.addChild(this.undoStack.at(-1))

    //     console.log({ u: this.undoStack, r: this.redoStack })
    // }

    // redo() {
    //     if (!this.redoStack.length) return

    //     const canvasSprite = this.redoStack.pop()
    //     this.undoStack.push(canvasSprite)

    //     this.container.removeChildren()
    //     this.container.addChild(this.eraseMask)
    //     this.container.addChild(canvasSprite)

    //     console.log({ u: this.undoStack, r: this.redoStack })
    // }

    startBrushStroke(_: PointerEvent, artist: Artist, erase: boolean = false) {        
        const settings = erase ? artist.eraserSettings : artist.brushSettings
        const brush = app.brushManager.getBrush(settings)
        
        const brushStroke = new BrushStroke(brush)
        this.container.addChild(brushStroke.container)

        this.liveBrushStrokes.set(artist.id, { brushStroke, pointerDown: true })
    }

    updateBrushStroke(e: PointerEvent, artist: Artist, erase: boolean = false) {

        if (!this.liveBrushStrokes.get(artist.id)) return

        const { brushStroke, pointerDown } = this.liveBrushStrokes.get(artist.id)

        if (pointerDown) {
            const { x, y } = e
            const pointInCanvasSpace = app.viewport.convertScreenToCanvas(x, y)
            brushStroke.addNode(pointInCanvasSpace.x, pointInCanvasSpace.y, e.pressure)
        }
    }

    updateBrushStrokeWithPointInCanvasSpace(e: PointerEvent, artist: Artist, erase: boolean = false) {

        if (!this.liveBrushStrokes.get(artist.id)) return

        const { brushStroke, pointerDown } = this.liveBrushStrokes.get(artist.id)

        if (pointerDown) {
            const { x, y } = e
            brushStroke.addNode(x, y, e.pressure)
        }
    }

    endBrushStroke(_: PointerEvent, artist: Artist, erase: boolean = false) {

        const { brushStroke } = this.liveBrushStrokes.get(artist.id)

        this.activeLayer.addBrushStroke(brushStroke.container)
        this.container.removeChild(brushStroke.container)

        this.liveBrushStrokes.set(artist.id, { brushStroke, pointerDown: false })
    }

    exportToPNG() {
        const renderTexture = app.renderTexturePool.acquire(this.settings.width, this.settings.height)
        app.application.renderer.render(this.container, { renderTexture })

        const canvas: HTMLCanvasElement = app.application.renderer.plugins.extract.canvas(new PIXI.Sprite(renderTexture))

        app.renderTexturePool.release(renderTexture)

        canvas.toBlob((blob) => {
            const a = document.createElement('a')
            document.body.append(a)
            a.download = "export.png"
            a.href = URL.createObjectURL(blob)
            a.click()
            a.remove()
        }, 'image/png')

    }

    exportToJPEG() {
        const renderTexture = app.renderTexturePool.acquire(this.settings.width, this.settings.height)
        app.application.renderer.render(this.container, { renderTexture })

        const canvas: HTMLCanvasElement = app.application.renderer.plugins.extract.canvas(new PIXI.Sprite(renderTexture))

        app.renderTexturePool.release(renderTexture)

        canvas.toBlob((blob) => {
            const a = document.createElement('a')
            document.body.append(a)
            a.download = "export.jpeg"
            a.href = URL.createObjectURL(blob)
            a.click()
            a.remove()
        }, 'image/jpeg')

    }
}

