import * as PIXI from 'pixi.js'
import type { BrushSettings } from 'src/models/BrushSettings'
import { handle_promise } from 'svelte/internal'
import { app } from '../App'
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

        const settings = erase ? this.eraserSettings : this.brushSettings
        const brush = app.brushManager.getBrush(settings)

        this.liveBrushStroke = new BrushStroke(brush)
        this.container.addChild(this.liveBrushStroke.container)
    }

    updateBrushStroke(e: PointerEvent, erase: boolean = false) {
        if (this.pointerDown) {
            const { x, y } = e
            const pointInCanvasSpace = app.viewport.convertScreenToCanvas(x, y)
            this.liveBrushStroke.addNode(pointInCanvasSpace.x, pointInCanvasSpace.y, e.pressure)
        }
    }

    updateBrushStrokeWithPointInCanvasSpace(e: PointerEvent, erase: boolean = false) {
        if (this.pointerDown) {
            const { x, y } = e
            this.liveBrushStroke.addNode(x, y, e.pressure)
        }
    }

    endBrushStroke(_: PointerEvent, erase: boolean = false) {
        this.pointerDown = false
        
        this.activeLayer.addBrushStroke(this.liveBrushStroke.container)
        this.container.removeChild(this.liveBrushStroke.container)
    }
}

