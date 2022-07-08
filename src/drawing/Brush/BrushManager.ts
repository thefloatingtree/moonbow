import type { BrushSettings } from 'src/models/BrushSettings'
import { Brush } from './Brush'

export class BrushManager {
    brushes: Map<string, Brush> = new Map<string, Brush>()

    getBrush(brushSettings: BrushSettings) {
        const { size, hardness, color, useSizePressure, useOpacityPressure } = brushSettings
        const key = JSON.stringify({ size, hardness, color, useSizePressure, useOpacityPressure })

        if (!this.brushes.has(key)) {
            this.brushes.set(key, new Brush(brushSettings))
        }

        return this.brushes.get(key)
    }
}