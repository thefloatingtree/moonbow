import type { ToolType } from "./ToolTypes"

export enum EventType {
    onMouseDown,
    onMouseUp,
    onMouseMove,
    onKeyboardUp,
    onKeyboardDown,
    onActivate,
    onWheel
}

export class Tool {

    actions: Array<{ event: EventType, action: Function }> = []

    constructor(public name: ToolType, public alwaysActive: boolean) {}

    onMouseDown(action: (e: PointerEvent) => any): Tool {
        this.actions.push({ event: EventType.onMouseDown, action })
        return this
    }

    onMouseUp(action: (e: PointerEvent) => any): Tool {
        this.actions.push({ event: EventType.onMouseUp, action })
        return this
    }

    onMouseMove(action: (e: PointerEvent) => any): Tool {
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

    onWheel(action: Function): Tool {
        this.actions.push({ event: EventType.onWheel, action })
        return this
    }
}