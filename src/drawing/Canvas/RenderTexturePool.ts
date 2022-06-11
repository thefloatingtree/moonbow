import * as PIXI from 'pixi.js'
import { app } from '../App'

export class RenderTexturePool {
    private renderTextures: Map<string, Array<PIXI.RenderTexture>> = new Map()

    acquire(width: number, height: number): PIXI.RenderTexture {
        const key = this.getKey(width, height)
        const releasedRenderTextures = this.getReleasedRenderTextures(key)

        if (releasedRenderTextures.length === 0) return PIXI.RenderTexture.create({ width, height })

        const renderTexture = releasedRenderTextures.pop()
        this.renderTextures.set(key, [ ...releasedRenderTextures ])
        return renderTexture
    }

    release(renderTexture: PIXI.RenderTexture) {
        const key = this.getKey(renderTexture.width, renderTexture.height)
        const releasedRenderTextures = this.getReleasedRenderTextures(key)

        this.renderTextures.set(key, [ ...releasedRenderTextures, renderTexture ])
    }

    private getKey(width: number, height: number): string {
        return width.toString() + height.toString() 
    }

    private getReleasedRenderTextures(key: string): Array<PIXI.RenderTexture> {
        if (this.renderTextures.get(key) === undefined) {
            this.renderTextures.set(key, [])
        }
        return this.renderTextures.get(key)
    }
}