import * as PIXI from 'pixi.js'
import type { BrushSettings } from 'src/models/BrushSettings'
import { app } from '../App'
import type { Artist } from '../Artist/Artist'
import { BrushStroke } from '../Brush/BrushStroke'
import { renderAsSprite } from '../util'


export class Canvas {
    public container: PIXI.Container = new PIXI.Container()
    public settings = {
        width: 1000,
        height: 1000,
        backgroundColor: 0xFFFFFF,
    }

    public defaultBrushSettings: BrushSettings = {
        color: "#03B3FF",
        opacity: 1,
        size: 10,
        spacing: 2,
        tipType: 'circle',
        hardness: 2,
        useSizePressure: true,
        useOpacityPressure: false,
    }

    public defaultEraserSettings: BrushSettings = {
        color: "#FFFFFF",
        opacity: 1,
        size: 10,
        spacing: 2,
        tipType: 'circle',
        hardness: 2,
        useSizePressure: true,
        useOpacityPressure: false,
    }


    private liveBrushStrokes: Map<string, { brushStroke: BrushStroke, pointerDown: Boolean }> = new Map()

    private undoStack: Map<string, Array<PIXI.Sprite>> = new Map()
    private redoStack: Map<string, Array<PIXI.Sprite>> = new Map()

    constructor() {
        const background = new PIXI.Graphics()
            .beginFill(this.settings.backgroundColor)
            .drawRect(0, 0, this.settings.width, this.settings.height)
            .endFill()
        this.container.addChild(background)
    }

    undo(artist: Artist) {
        if (!this.undoStack.get(artist.id).length) return

        const undoneStrokeSprite: PIXI.Sprite = popFromArrayInMap(this.undoStack, artist.id)
        appendToArrayInMap(this.redoStack, artist.id, undoneStrokeSprite)

        this.container.removeChild(undoneStrokeSprite)

        // console.log({ u: this.undoStack, r: this.redoStack })
    }

    redo(artist: Artist) {
        if (!this.redoStack.get(artist.id).length) return

        const redoneStrokeSprite: PIXI.Sprite = popFromArrayInMap(this.redoStack, artist.id)
        appendToArrayInMap(this.undoStack, artist.id, redoneStrokeSprite)

        this.container.addChild(redoneStrokeSprite)

        // console.log({ u: this.undoStack, r: this.redoStack })
    }

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
            const { x, y, pressure } = e
            const pointInCanvasSpace = app.viewport.convertScreenToCanvas(x, y)
            brushStroke.addNode(pointInCanvasSpace.x, pointInCanvasSpace.y, pressure)
        }
    }

    updateBrushStrokeWithPointInCanvasSpace(e: PointerEvent, artist: Artist, erase: boolean = false) {

        if (!this.liveBrushStrokes.get(artist.id)) return

        const { brushStroke, pointerDown } = this.liveBrushStrokes.get(artist.id)

        if (pointerDown) {
            const { x, y, pressure } = e
            brushStroke.addNode(x, y, pressure)
        }
    }

    endBrushStroke(_: PointerEvent, artist: Artist, erase: boolean = false) {
        const { brushStroke } = this.liveBrushStrokes.get(artist.id)

        this.finishBrushStroke(brushStroke.container, artist)
        this.container.removeChild(brushStroke.container)

        this.liveBrushStrokes.set(artist.id, { brushStroke, pointerDown: false })
    }

    private finishBrushStroke(stroke: PIXI.Container, artist: Artist) {
        const strokeRenderTexture = app.renderTexturePool.acquire(this.settings.width, this.settings.height)
        const strokeSprite = renderAsSprite(stroke, strokeRenderTexture)
        this.container.addChild(strokeSprite)
        appendToArrayInMap(this.undoStack, artist.id, strokeSprite)

        this.redoStack.get(artist.id)?.forEach(sprite => app.renderTexturePool.release(sprite.texture as PIXI.RenderTexture))
        this.redoStack.set(artist.id, [])
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

function appendToArrayInMap(map: Map<any, Array<any>>, key: string, value: any) {
    if (!map.get(key)) map.set(key, [])
    map.get(key).push(value)
}

function popFromArrayInMap(map: Map<any, Array<any>>, key: string) {
    if (!map.get(key)) map.set(key, [])
    return map.get(key).pop()
}