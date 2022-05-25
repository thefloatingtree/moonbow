import getStroke, { getStrokePoints } from 'perfect-freehand'
import * as PIXI from 'pixi.js'
import { app } from './App'
import { cardinalSpline, Easing, lerp } from './util'

export class Canvas {
    public container: PIXI.Container = new PIXI.Container()
    
    private liveBrushStroke: BrushStroke = new BrushStroke()
    private pointerDown: boolean

    private undoStack: Array<PIXI.Sprite> = []
    private redoStack: Array<PIXI.Sprite> = []
 
    settings = {
        width: 500,
        height: 500,
        backgroundColor: 0xFFFFFF
    }

    constructor() {
        const background = new PIXI.Graphics()
            .beginFill(this.settings.backgroundColor)
            .drawRect(0, 0, this.settings.width, this.settings.height)
            .endFill()
        this.container.addChild(background)

        this.endBrushStroke(null)
    }

    undo() {
        if (this.undoStack.length <= 1) return

        const currentCanvasSprite = this.undoStack.pop()
        this.redoStack.push(currentCanvasSprite)

        this.container.removeChildren()
        this.container.addChild(this.undoStack.at(-1))

        console.log({ u: this.undoStack, r: this.redoStack })
    }

    redo() {
        if (!this.redoStack.length) return

        const canvasSprite = this.redoStack.pop()
        this.undoStack.push(canvasSprite)

        this.container.removeChildren()
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

        const canvasTexture = PIXI.RenderTexture.create({
            width: this.settings.width,
            height: this.settings.height
        })
        app.application.renderer.render(this.container, { renderTexture: canvasTexture })
        const canvasSprite = new PIXI.Sprite(canvasTexture)
        
        this.container.removeChildren()

        this.container.addChild(canvasSprite)
        this.undoStack.push(canvasSprite)
        this.redoStack = []

        console.log({ u: this.undoStack, r: this.redoStack })
    }
}

export class BrushStroke {

    container: PIXI.Container = new PIXI.Container()
    smoothStroke: SmoothStroke = new SmoothStroke()

    lastPressure: number = 0

    addNode(x: number, y: number, pressure: number, texture?: PIXI.RenderTexture) {
        const points = this.smoothStroke.addPoint(x, y)
        for (let i = 0; i < points.length; i++) {
            const { x, y } = points[i]

            // const interpolatedPressure = lerp(this.lastPressure, pressure, i / points.length)
            // const actualPressure = points.length === 1 ? pressure : interpolatedPressure
            
            // const opacityPressure = this.brush.opacityPressure ? actualPressure : 1
            // const sizePressure = this.brush.sizePressure ? actualPressure : 1

            // const brushAlpha = lerp(0, 1, Easing.easeInExpo(opacityPressure))
            // const brushSize = lerp(this.brush.sizeMin, this.brush.size, Easing.easeInQuad(sizePressure)) / 100

            // const brushColor = this.brush.isErasing ? this.izzy.backgroundColor : this.brush.colorHex

            const sprite = PIXI.Sprite.from('./src/assets/hard_round.png')
            sprite.position.set(x, y)
            sprite.anchor.set(0.5)
            sprite.tint = 0x000000
            // sprite.alpha = brushAlpha
            sprite.scale.set(0.1)
            this.container.addChild(sprite)

            // this.alphaFilter.alpha = this.brush.opacity
            // this.container.filters = [this.alphaFilter]
        }

        

        // const temp = new PIXI.Graphics()
        //     .beginFill(0x000000)
        //     .drawPolygon(points.map(([x, y]) => new PIXI.Point(x, y)))
        //     .endFill()

        // this.container.addChild(temp)


        // this.lastPressure = pressure
    }
}

export class SmoothStroke {
    points = []
    ignorePointThreshold = 3
    spacing = 2

    addPoint(x: number, y: number) {
        this.points.push(new Point(x, y))

        if (this.points.length === 1) {
            const A = this.points[this.points.length - 1]
            return this._makeDot(A)
        }
        if (this.points.length === 2 || this.points.length === 3) {
            const A = this.points[this.points.length - 2]
            const B = this.points[this.points.length - 1]
            return this._makeLine(A, B)
        }

        const A = this.points[this.points.length - 4]
        const B = this.points[this.points.length - 3]
        const C = this.points[this.points.length - 2]
        const D = this.points[this.points.length - 1]
        return this._makeCurve(A, B, C, D)
    }

    _makeDot(point: Point) {
        return [point]
    }

    _makeLine(A: Point, B: Point) {
        const distance = A.distanceTo(B)
        const steps = distance * this.spacing

        const interpolatedPoints = []
        for (let i = 0; i < steps; i++) {
            const x = lerp(A.x, B.x, i / (steps - 1))
            const y = lerp(A.y, B.y, i / (steps - 1))
            interpolatedPoints.push({ x, y })
        }
        return interpolatedPoints
    }

    _makeCurve(A: Point, B: Point, C: Point, D: Point) {
        const distance = B.distanceTo(C)
        const steps = Math.floor(distance * this.spacing)
        const interpolatedPoints = []
        for (let i = 0; i < steps; i++) {
            // const point = { x: lerp(B.x, C.x, i / (steps - 1)), y: lerp(B.y, C.y, i / (steps - 1)) }
            const point = cardinalSpline(i / (steps), 0.5, A, B, C, D)
            interpolatedPoints.push(point)
        }
        return interpolatedPoints
    }
}

class Point {
    constructor(public x: number, public y: number) {
        this.x = x
        this.y = y
    }

    distanceTo(point: Point) {
        return Math.sqrt((point.x - this.x) ** 2 + (point.y - this.y) ** 2)
    }
}