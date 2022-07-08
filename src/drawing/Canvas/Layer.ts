import * as PIXI from 'pixi.js'
import { app } from '../App'
import { renderAsSprite } from '../util'
import type { Canvas } from './Canvas'

// const fShader = frag`

// varying vec2 vTextureCoord;
// uniform sampler2D uSampler;

// void main(void)
// {
//     gl_FragColor = texture2D(uSampler, vTextureCoord);
//     gl_FragColor.r = 1.0;
// }
// `

export class Layer {
    public container: PIXI.Container = new PIXI.Container()
    // private filter = new PIXI.Filter(null, fShader)

    constructor(private canvas: Canvas) {
        // const maskGraphics = new PIXI.Graphics()
        //     .beginFill(0xFF0000)
        //     .drawRect(0, 0, this.canvas.settings.width, this.canvas.settings.height)
        //     .endFill()
    
        // const maskSprite = renderAsSprite(maskGraphics, app.renderTexturePool.acquire(this.canvas.settings.width, this.canvas.settings.height))

        // this.applyMask(maskSprite)
    }

    addBrushStroke(stroke: PIXI.Container) {
        const strokeRenderTexture = app.renderTexturePool.acquire(this.canvas.settings.width, this.canvas.settings.height)
        const strokeSprite = renderAsSprite(stroke, strokeRenderTexture)
        this.container.addChild(strokeSprite)
        
        // const maskStrokeRenderTexture = app.renderTexturePool.acquire(this.canvas.settings.width, this.canvas.settings.height)
        // const maskSprite = renderAsSprite(stroke, maskStrokeRenderTexture)
        // maskSprite.filters = [ this.filter ]
        // this.addSpriteToMask(maskSprite)

        // app.renderTexturePool.release(maskStrokeRenderTexture)
    }

    // addEraserStroke(stroke: PIXI.Container) {
    //     const strokeRenderTexture = app.renderTexturePool.acquire(this.canvas.settings.width, this.canvas.settings.height)
    //     const strokeSprite = renderAsSprite(stroke, strokeRenderTexture)
    //     strokeSprite.tint = 0x000000

    //     this.addSpriteToMask(strokeSprite)

    //     app.renderTexturePool.release(strokeRenderTexture)
    // }

    // addSpriteToMask(sprite: PIXI.Sprite) {
    //     const previousMaskSprite = new PIXI.Sprite(this.container.mask['texture'])
    //     // this.container.mask = null

    //     const tempContainer = new PIXI.Container()
    //     tempContainer.addChild(previousMaskSprite as PIXI.DisplayObject)
    //     tempContainer.addChild(sprite)

    //     // Acquire a new render texture, will be relased next time
    //     const newMaskRenderTexture = app.renderTexturePool.acquire(this.canvas.settings.width, this.canvas.settings.height)
    //     const oldMaskRenderTexture = previousMaskSprite.texture as PIXI.RenderTexture
    //     // Order is important
    //     const newMask = renderAsSprite(tempContainer, newMaskRenderTexture)
    //     app.renderTexturePool.release(oldMaskRenderTexture)

    //     this.applyMask(newMask)
    // }

    // private applyMask(mask: PIXI.Sprite) {
    //     this.container.removeChild(this.container.mask as PIXI.DisplayObject)
    //     this.container.addChild(mask)
    //     this.container.mask = mask
    // }
}