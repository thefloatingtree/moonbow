import * as PIXI from 'pixi.js'
import type { BrushSettings } from 'src/models/BrushSettings'
import { app } from '../App'
import { SmoothStroke } from './SmothStroke'

export class BrushStroke {

    container: PIXI.Container = new PIXI.Container()
    smoothStroke: SmoothStroke = new SmoothStroke()
    alphaFilter = new PIXI.filters.AlphaFilter()

    lastPressure: number = 0

    addNode(x: number, y: number, pressure: number, brushSettings: BrushSettings, erase: boolean) {
        const points = this.smoothStroke.addPoint(x, y)
        for (let i = 0; i < points.length; i++) {
            const { x, y } = points[i]

            // const interpolatedPressure = lerp(this.lastPressure, pressure, i / points.length)
            // const actualPressure = points.length === 1 ? pressure : interpolatedPressure

            // const opacityPressure = this.brush.opacityPressure ? actualPressure : 1
            // const sizePressure = this.brush.sizePressure ? actualPressure : 1

            // const brushAlpha = lerp(0, 1, Easing.easeInExpo(opacityPressure))
            // const brushSize = lerp(this.brush.sizeMin, this.brush.size, Easing.easeInQuad(sizePressure)) / 100

            const brushColor = erase ? app.canvas.settings.backgroundColor : PIXI.utils.string2hex(brushSettings.color)

            const sprite = PIXI.Sprite.from('./src/assets/hard_round.png')
            sprite.position.set(x, y)
            sprite.anchor.set(0.5)
            sprite.tint = brushColor
            sprite.scale.set(brushSettings.size)
            this.container.addChild(sprite)

            this.alphaFilter.alpha = brushSettings.opacity
            this.container.filters = [this.alphaFilter]
        }

        this.lastPressure = pressure
    }
}