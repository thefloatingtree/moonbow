import { writable } from "svelte/store";
import { app } from "../../drawing/App";
import _ from "svelte-awesome-color-picker/util/convert"

export const colorPickerStore = writable(null)

app.onAfterInit(() => {
    colorPickerStore.set({ hex: app.canvas.brushSettings.color })
})
