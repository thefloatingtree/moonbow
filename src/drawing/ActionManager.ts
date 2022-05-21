import type { Action } from "./Actions"
import { app } from "./App"

export class ActionManager {
    private keyboard: Object = {}
    private actions: Array<Action> = []

    constructor() {
        this.setupEvents()
    }

    addAction(action: Action) {
        this.actions.push(action)
    }

    setupEvents() {
        // app.ref.addEventListener('pointerdown', (e) => {

        // })
        // app.ref.addEventListener('pointerup', () => {

        // })
        // app.ref.addEventListener('pointermove', (e) => {

        // })
        window.addEventListener('keyup', (e) => {
            this.keyboard[e.key.toLowerCase()] = false

            this.actions.forEach(action => {
                action.onUp(this.keyboard)
            })
        })
        
        window.addEventListener('keydown', (e) => {
            this.keyboard[e.key.toLowerCase()] = true

            this.actions.forEach(action => {
                action.onDown(this.keyboard)
            })
        })
    }
}