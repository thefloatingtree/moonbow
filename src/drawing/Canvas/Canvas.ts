import * as PIXI from 'pixi.js'
import { MessageTypes } from '../../../server/MessageTypes'
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
        historyStates: 25
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
    private flattenedCanvas: PIXI.Sprite = new PIXI.Sprite()

    private undoStack: Map<string, Array<PIXI.Sprite>> = new Map()
    private redoStack: Map<string, Array<PIXI.Sprite>> = new Map()

    constructor() {
        const background = new PIXI.Graphics()
            .beginFill(this.settings.backgroundColor)
            .drawRect(0, 0, this.settings.width, this.settings.height)
            .endFill()
        this.container.addChild(background)
        this.container.addChild(this.flattenedCanvas)
    }

    addListeners() {
        app.connection.addMessageListener((message) => {
            if (message.type === MessageTypes.OnClientConnected) {
                app.canvas.flattenHistory()
            }
        })
    }

    serialize() {
        this.flattenHistory()
        const base64FlattenedCanvas = app.application.renderer.plugins.extract.base64(this.flattenedCanvas)
        return { base64FlattenedCanvas }
    }

    deserialize(data: { base64FlattenedCanvas: string }) {
        const canvas = PIXI.Sprite.from(data.base64FlattenedCanvas)

        this.container.removeChildAt(1)
        this.container.addChildAt(canvas, 1)
    }

    undo(artist: Artist) {
        if (!this.undoStack.get(artist.id).length) return

        const undoneStrokeSprite: PIXI.Sprite = popFromArrayInMap(this.undoStack, artist.id)
        appendToArrayInMap(this.redoStack, artist.id, undoneStrokeSprite)

        this.container.removeChild(undoneStrokeSprite)
    }

    redo(artist: Artist) {
        if (!this.redoStack.get(artist.id).length) return

        const redoneStrokeSprite: PIXI.Sprite = popFromArrayInMap(this.redoStack, artist.id)
        appendToArrayInMap(this.undoStack, artist.id, redoneStrokeSprite)

        this.container.addChild(redoneStrokeSprite)
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

        if (this.undoStack.get(artist.id).length > this.settings.historyStates) {
            const strokeToBeFlattened = this.undoStack.get(artist.id).shift()
            this.flatten(strokeToBeFlattened)
        }

        this.redoStack.get(artist.id)?.forEach(sprite => app.renderTexturePool.release(sprite.texture as PIXI.RenderTexture))
        this.redoStack.set(artist.id, [])
    }

    private flatten(stroke: PIXI.Sprite) {
        const renderTexture = app.renderTexturePool.acquire(this.settings.width, this.settings.height)

        const tempContainer = new PIXI.Container()
        tempContainer.addChild(this.flattenedCanvas)    // Adding these to the temp container removes them from
        tempContainer.addChild(stroke)                  // the main container
        const tempFlattenedCanvas = renderAsSprite(tempContainer, renderTexture)

        app.renderTexturePool.release(this.flattenedCanvas.texture as PIXI.RenderTexture)
        this.flattenedCanvas = tempFlattenedCanvas

        this.container.addChildAt(this.flattenedCanvas, 1)

        app.renderTexturePool.release(stroke.texture as PIXI.RenderTexture)
    }

    flattenHistory() {
        this.undoStack.forEach((strokes, artistId) => {
            strokes.reverse().forEach(stroke => {
                this.flatten(stroke)
            })
            this.redoStack.get(artistId)?.forEach(sprite => app.renderTexturePool.release(sprite.texture as PIXI.RenderTexture))
            this.redoStack.set(artistId, [])
            this.undoStack.set(artistId, [])
        })
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