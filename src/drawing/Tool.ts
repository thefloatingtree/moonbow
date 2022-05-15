export enum EventType {
    onMouseDown,
    onMouseUp,
    onMouseMove,
    onKeyboardUp,
    onKeyboardDown,
    onActivate
}

export class Tool {

    actions: Array<{ event: EventType, action: Function }> = []

    constructor(public name: String) {}

    onMouseDown(action: Function): Tool {
        this.actions.push({ event: EventType.onMouseDown, action })
        return this
    }

    onMouseUp(action: Function): Tool {
        this.actions.push({ event: EventType.onMouseUp, action })
        return this
    }

    onMouseMove(action: Function): Tool {
        this.actions.push({ event: EventType.onMouseMove, action })
        return this
    }

    onKeyboardUp(action: Function): Tool {
        this.actions.push({ event: EventType.onKeyboardUp, action })
        return this
    }

    onKeyboardDown(action: Function): Tool {
        this.actions.push({ event: EventType.onKeyboardDown, action })
        return this
    }

    onActivate(action: Function): Tool {
        this.actions.push({ event: EventType.onActivate, action })
        return this
    }
}