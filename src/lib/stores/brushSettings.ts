import { derived, writable } from "svelte/store";

export const brushColor = writable(null)
export const brushOpacity = writable(null)
export const brushSize = writable(null)
export const brushHardness = writable(null)
export const brushSpacing = writable(null)
export const brushTipType = writable(null)
export const brushUseSizePressure = writable(null)
export const brushUseOpacityPressure = writable(null)

export const brushSettings = derived(
    [brushColor, brushOpacity, brushSize, brushHardness, brushSpacing, brushTipType, brushUseSizePressure, brushUseOpacityPressure],
    ([$brushColor, $brushOpacity, $brushSize, $brushHardness, $brushSpacing, $brushTipType, $brushUseSizePressure, $brushUseOpacityPressure]) => {
        return {
            color: $brushColor,
            opacity: $brushOpacity,
            size: $brushSize,
            spacing: $brushSpacing,
            tipType: $brushTipType,
            hardness: $brushHardness,
            useSizePressure: $brushUseSizePressure,
            useOpacityPressure: $brushUseOpacityPressure
        }
    })