import { derived, writable } from "svelte/store";

export const eraserOpacity = writable(null)
export const eraserSize = writable(null)
export const eraserHardness = writable(null)
export const eraserSpacing = writable(null)
export const eraserTipType = writable(null)
export const eraserUseSizePressure = writable(null)
export const eraserUseOpacityPressure = writable(null)

export const eraserSettings = derived(
    [eraserOpacity, eraserSize, eraserHardness, eraserSpacing, eraserTipType, eraserUseSizePressure, eraserUseOpacityPressure],
    ([$eraserOpacity, $eraserSize, $eraserHardness, $eraserSpacing, $eraserTipType, $eraserUseSizePressure, $eraserUseOpacityPressure]) => {
        return {
            color: '#FFFFFF',
            opacity: $eraserOpacity,
            size: $eraserSize,
            spacing: $eraserSpacing,
            tipType: $eraserTipType,
            hardness: $eraserHardness,
            useSizePressure: $eraserUseSizePressure,
            useOpacityPressure: $eraserUseOpacityPressure
        }
    })