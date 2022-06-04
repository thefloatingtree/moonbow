import type { Action } from "./Actions"

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

        window.addEventListener('mouseup', (e: MouseEvent) => {
            if (e.button === 0) this.keyboard['mouseleft'] = false
            if (e.button === 1) this.keyboard['mousemiddle'] = false
            if (e.button === 2) this.keyboard['mouseright'] = false

            this.actions.forEach(action => {
                action.onUp(this.keyboard)
            })
        })

        window.addEventListener('mousedown', (e: MouseEvent) => {
            if (e.button === 0) this.keyboard['mouseleft'] = true
            if (e.button === 1) this.keyboard['mousemiddle'] = true
            if (e.button === 2) this.keyboard['mouseright'] = true

            this.actions.forEach(action => {
                action.onDown(this.keyboard)
            })
        })
    }
}