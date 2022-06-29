import type { IEventSource } from "../Events/IEventSource"
import type { Action } from "./Actions"

export class ActionManager {
    private keyboard: Object = {}
    private actions: Array<Action> = []

    constructor(private eventSource: IEventSource) {
        this.eventSource.onMouseDown((e) => {
            if (e.button === 0) this.keyboard['mouseleft'] = true
            if (e.button === 1) this.keyboard['mousemiddle'] = true
            if (e.button === 2) this.keyboard['mouseright'] = true

            this.actions.forEach(action => {
                action.onDown(this.keyboard)
            })
        })
        this.eventSource.onMouseUp((e) => {
            if (e.button === 0) this.keyboard['mouseleft'] = false
            if (e.button === 1) this.keyboard['mousemiddle'] = false
            if (e.button === 2) this.keyboard['mouseright'] = false

            this.actions.forEach(action => {
                action.onUp(this.keyboard)
            })
        })
        this.eventSource.onKeyboardDown((e) => {
            this.keyboard[e.key.toLowerCase()] = true

            this.actions.forEach(action => {
                action.onDown(this.keyboard)
            })
        })
        this.eventSource.onKeyboardUp((e) => {
            this.keyboard[e.key.toLowerCase()] = false

            this.actions.forEach(action => {
                action.onUp(this.keyboard)
            })
        })
    }

    addAction(action: Action) {
        this.actions.push(action)
    }
}