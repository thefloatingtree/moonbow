import * as PIXI from 'pixi.js'
import type { BrushSettings } from 'src/models/BrushSettings'
import { app } from '../App'

export class Brush {

    public tipTexture: PIXI.Texture
    private blurFilter: PIXI.Filter

    constructor(
        public brushSettings: BrushSettings
    ) {
        let brushTipGraphics
        if (brushSettings.tipType === 'circle') {
            brushTipGraphics = new PIXI.Graphics()
            .beginFill(PIXI.utils.string2hex(brushSettings.color))
            .drawCircle(0, 0, brushSettings.size)
            .endFill()
        }
        if (brushSettings.tipType === 'square') {
            brushTipGraphics = new PIXI.Graphics()
            .beginFill(PIXI.utils.string2hex(brushSettings.color))
            .drawRect(0, 0, brushSettings.size, brushSettings.size)
            .endFill()
        }
        
        this.blurFilter = new PIXI.filters.BlurFilter(brushSettings.hardness, 10)
        brushTipGraphics.filters = [this.blurFilter]

        this.tipTexture = app.application.renderer.generateTexture(brushTipGraphics, {
            region: new PIXI.Rectangle(-brushTipGraphics.width, -brushTipGraphics.height, brushTipGraphics.width * 2, brushTipGraphics.height * 2)
        })
    }
}