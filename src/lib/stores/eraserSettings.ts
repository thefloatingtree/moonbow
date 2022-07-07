import { derived, writable } from "svelte/store";

export const eraserOpacity = writable(null)
export const eraserSize = writable(null)
export const eraserHardness = writable(null)
export const eraserSpacing = writable(null)
export const eraserTipType = writable(null)

export const eraserSettings = derived(
    [eraserOpacity, eraserSize, eraserHardness, eraserSpacing, eraserTipType],
    ([$eraserOpacity, $eraserSize, $eraserHardness, $eraserSpacing, $eraserTipType]) => {
        return {
            color: '#FFFFFF',
            opacity: $eraserOpacity,
            size: $eraserSize,
            spacing: $eraserSpacing,
            tipType: $eraserTipType,
            hardness: $eraserHardness,
        }
    })