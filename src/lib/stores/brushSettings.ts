import { BrushSettings } from "../../models/BrushSettings";
import { writable } from "svelte/store";
import { app } from "../../drawing/App";

// export const brushSettings = writable<BrushSettings>(new BrushSettings())

// app.onAfterInit(() => {
//     brushSettings.subscribe(diff => {
//         app.canvas.brushSettings = {
//             ...app.canvas.brushSettings,
//             ...diff
//         }
//     })
// })

export const color = writable(null)
export const opacity = writable(null)
export const size = writable(null)

app.onAfterInit(() => {
    color.set(app.canvas.brushSettings.color)
    opacity.set(app.canvas.brushSettings.opacity)
    size.set(app.canvas.brushSettings.size)

    color.subscribe(color => app.canvas.brushSettings.color = color)
    opacity.subscribe(opacity => app.canvas.brushSettings.opacity = opacity)
    size.subscribe(size => app.canvas.brushSettings.size = size)
})