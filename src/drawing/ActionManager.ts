import type { Action } from "./Action"
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
        app.ref.addEventListener('pointerdown', (e) => {

        })
        app.ref.addEventListener('pointerup', () => {

        })
        app.ref.addEventListener('pointermove', (e) => {

        })
        window.addEventListener('keyup', (e) => {
            this.keyboard[e.key] = false
        })
        
        window.addEventListener('keydown', (e) => {
            this.keyboard[e.key] = true

            this.actions.forEach(action => {
                action.match(this.keyboard)
            })
        })
    }
}