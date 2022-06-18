import * as PIXI from 'pixi.js'
import type { BrushSettings } from 'src/models/BrushSettings'
import { app } from '../App'
import type { Brush } from './Brush'
import { SmoothStroke } from './SmothStroke'

export class BrushStroke {

    
    public container: PIXI.Container = new PIXI.Container()
    private smoothStroke: SmoothStroke
    private alphaFilter = new PIXI.filters.AlphaFilter()
    
    // private lastPressure: number = 0

    constructor(public brush: Brush) {
        this.smoothStroke = new SmoothStroke(brush.brushSettings.spacing)
    }

    addNode(x: number, y: number, pressure: number) {
        const points = this.smoothStroke.addPoint(x, y)
        for (let i = 0; i < points.length; i++) {
            const { x, y } = points[i]

            // const interpolatedPressure = lerp(this.lastPressure, pressure, i / points.length)
            // const actualPressure = points.length === 1 ? pressure : interpolatedPressure

            // const opacityPressure = this.brush.opacityPressure ? actualPressure : 1
            // const sizePressure = this.brush .sizePressure ? actualPressure : 1

            // const brushAlpha = lerp(0, 1, Easing.easeInExpo(opacityPressure))
            // const brushSize = lerp(this.brush.sizeMin, this.brush.size, Easing.easeInQuad(sizePressure)) / 100

            const sprite = new PIXI.Sprite(this.brush.tipTexture)
            sprite.anchor.set(0.5)
            sprite.position.set(x, y)
            this.container.addChild(sprite)

            this.alphaFilter.alpha = this.brush.brushSettings.opacity
            this.container.filters = [this.alphaFilter]
        }

        // this.lastPressure = pressure
    }
}