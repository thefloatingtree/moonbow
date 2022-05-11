import getStroke, { getStrokePoints } from 'perfect-freehand'
import * as PIXI from 'pixi.js'
import { app } from './App'
import { Easing, lerp } from './util'

export class Canvas {
    container: PIXI.Container
    pointerDown: boolean
    
    liveBrushStroke
    renderer: PIXI.AbstractRenderer

    brushTexture: PIXI.RenderTexture

    settings = {
        width: 500,
        height: 500,
        backgroundColor: 0xFFFFFF
    }

    constructor() {
        this.container = new PIXI.Container()

        this.renderer = PIXI.autoDetectRenderer({
            width: this.settings.width,
            height: this.settings.height,
            backgroundColor: this.settings.backgroundColor,
            antialias: true
        })

        const background = new PIXI.Graphics()
            .beginFill(this.settings.backgroundColor)
            .drawRect(0, 0, 500, 500)
            .endFill()
        // this.container.addChild(background)

        // const brushGraphic = new PIXI.Graphics()
        //     .beginFill(0x000000)
        //     .drawCircle(10, 10, 10)
        //     .endFill()
        
        // const renderTexture = PIXI.RenderTexture.create({ width: brushGraphic.width, height: brushGraphic.height })
        // this.renderer.render(brushGraphic, { renderTexture })

        const test = new BrushStroke()
        test.addNode(0, 0, 0)
        this.container.addChild(test.container)
    }

    setupEvents() {
        // Add event listners
        app.ref.addEventListener('pointerdown', (e) => {
            // const { x, y } = this._getRelativePointerPosition(e)

            this.pointerDown = true
            // app.beginBrushStroke()
            // app.addBrushNode(x, y, e.pressure)
        })
        app.ref.addEventListener('pointerup', () => {
            this.pointerDown = false
            // app.endBrushStroke()
        })
        app.ref.addEventListener('pointermove', (e) => {
            if (this.pointerDown) {
                // let { x, y } = this._getRelativePointerPosition(e)
                // app.addBrushNode(x, y, e.pressure)
                console.log(e.x)
            }
        })
    }
}

export class BrushStroke {

    container: PIXI.Container = new PIXI.Container()
    lastPressure: number = 0

    addNode(x: number, y: number, pressure: number, texture?: PIXI.RenderTexture) {
        const points = getStrokePoints([[0, 0], [100, 100], [340, 123], [500, 500]], { streamline: 0.5 })
        for (let i = 0; i < points.length; i++) {
            const [x, y] = points[i].point
            console.log(points[i])

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
            // sprite.tint = brushColor
            // sprite.alpha = brushAlpha
            sprite.scale.set(0.03)
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