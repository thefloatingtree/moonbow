import * as PIXI from 'pixi.js'
import { app } from '../App'
import { BrushStroke } from './BrushStroke'


function renderAsSprite(object: PIXI.DisplayObject, width: number, height: number): PIXI.Sprite {
    const renderTexture = PIXI.RenderTexture.create({ width, height })
    app.application.renderer.render(object, { renderTexture })
    return new PIXI.Sprite(renderTexture)
}

export class Canvas {
    public container: PIXI.Container = new PIXI.Container()

    private liveBrushStroke: BrushStroke
    private pointerDown: boolean

    private undoStack: Array<PIXI.Sprite> = []
    private redoStack: Array<PIXI.Sprite> = []

    private eraseMask: PIXI.Sprite = new PIXI.Sprite()

    settings = {
        width: 1000,
        height: 1000,
        backgroundColor: 0xFFFFFF
    }

    constructor() {
        const background = new PIXI.Graphics()
            .beginFill(this.settings.backgroundColor)
            .drawRect(0, 0, this.settings.width, this.settings.height)
            .endFill()
        this.container.addChild(background)

        const maskGraphics = new PIXI.Graphics()
            .beginFill(0xFF0000)
            .drawRect(0, 0, this.settings.width, this.settings.height)
            .endFill()
        
        const maskSprite = renderAsSprite(maskGraphics, this.settings.width, this.settings.height)

        this.applyMask(maskSprite)
    }

    undo() {
        if (this.undoStack.length <= 1) return

        const currentCanvasSprite = this.undoStack.pop()
        this.redoStack.push(currentCanvasSprite)

        this.container.removeChildren()
        this.container.addChild(this.eraseMask)
        this.container.addChild(this.undoStack.at(-1))

        console.log({ u: this.undoStack, r: this.redoStack })
    }

    redo() {
        if (!this.redoStack.length) return

        const canvasSprite = this.redoStack.pop()
        this.undoStack.push(canvasSprite)

        this.container.removeChildren()
        this.container.addChild(this.eraseMask)
        this.container.addChild(canvasSprite)

        console.log({ u: this.undoStack, r: this.redoStack })
    }

    startBrushStroke(_: PointerEvent) {
        this.pointerDown = true

        this.liveBrushStroke = new BrushStroke()
        this.container.addChild(this.liveBrushStroke.container)
    }

    updateBrushStroke(e: PointerEvent) {
        if (this.pointerDown) {
            let { x, y } = e

            const adjusted = app.viewport.convertScreenToCanvas(x, y)

            this.liveBrushStroke.addNode(adjusted.x, adjusted.y, e.pressure)
        }
    }

    endBrushStroke(_: PointerEvent) {
        this.pointerDown = false

        const canvasSprite = renderAsSprite(this.container, this.settings.width, this.settings.height)

        this.container.removeChildren()
        this.container.addChild(canvasSprite)
        
        this.updateEraseMask()
        // this.container.addChild(this.eraseMask)
        // this.undoStack.push(canvasSprite)
        // this.redoStack = []
    }

    private updateEraseMask() {

        const previousMask = this.container.mask
        this.container.mask = null

        const strokeSprite = renderAsSprite(this.liveBrushStroke.container, this.settings.width, this.settings.height)
        const tempContainer = new PIXI.Container()
        tempContainer.addChild(previousMask as PIXI.DisplayObject)
        tempContainer.addChild(strokeSprite)

        const newMask = renderAsSprite(tempContainer, this.settings.width, this.settings.height)

        this.applyMask(newMask)

        tempContainer.destroy()

        // this.container.addChild(this.eraseMask)
        // this.container.mask = this.eraseMask
    }

    private applyMask(mask: PIXI.Sprite) {
        this.container.addChild(mask)
        this.container.mask = mask
    }
}

