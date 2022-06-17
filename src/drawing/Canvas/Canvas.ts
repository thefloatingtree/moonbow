import * as PIXI from 'pixi.js'
import type { BrushSettings } from 'src/models/BrushSettings'
import { app } from '../App'
import { BrushStroke } from './BrushStroke'
import { Layer } from './Layer'


export class Canvas {
    public container: PIXI.Container = new PIXI.Container()
    public settings = {
        width: 1000,
        height: 1000,
        backgroundColor: 0xFFFFFF,
    }

    public brushSettings: BrushSettings = {
        color: "#FFF000",
        opacity: 1,
        size: 0.1,
    }

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

    startBrushStroke(_: PointerEvent, erase: boolean = false) {
        this.pointerDown = true

        this.liveBrushStroke = new BrushStroke()
        this.container.addChild(this.liveBrushStroke.container)
    }

    updateBrushStroke(e: PointerEvent, erase: boolean = false) {
        if (this.pointerDown) {
            const { x, y } = e
            const adjusted = app.viewport.convertScreenToCanvas(x, y)
            this.liveBrushStroke.addNode(adjusted.x, adjusted.y, e.pressure, this.brushSettings, erase)

            // if (erase) {
            //     this.activeLayer.addEraserStroke(this.liveBrushStroke.container)
            // }
        }
    }

    endBrushStroke(_: PointerEvent, erase: boolean = false) {
        this.pointerDown = false
        
        this.activeLayer.addBrushStroke(this.liveBrushStroke.container)
        this.container.removeChild(this.liveBrushStroke.container)

        // this.updateEraseMask()
        // this.container.addChild(this.eraseMask)
        // this.undoStack.push(canvasSprite)
        // this.redoStack = []
    }
}

