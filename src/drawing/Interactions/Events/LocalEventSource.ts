import { app } from "../../App";
import type { IEventSource } from "./IEventSource";

export class LocalEventSource implements IEventSource {

    private mouseDownActions: Array<(e: PointerEvent) => any> = []
    private mouseUpActions: Array<(e: PointerEvent) => any> = []
    private mouseMoveActions: Array<(e: PointerEvent) => any> = []
    private keyboardUpActions: Array<(e: KeyboardEvent) => any> = []
    private keyboardDownActions: Array<(e: KeyboardEvent) => any> = []
    private wheelActions: Array<(e: WheelEvent) => any> = []

    private handlers: { [eventType in 'pointerdown' | 'pointerup' | 'pointermove' | 'keyup' | 'keydown' | 'wheel']: (e: Event) => void }

    constructor() {
        this.handlers = {
            'pointerdown': (e) => this.mouseDownActions.forEach(action => action(e as PointerEvent)),
            'pointerup': (e) => this.mouseUpActions.forEach(action => action(e as PointerEvent)),
            'pointermove': (e) => this.mouseMoveActions.forEach(action => action(e as PointerEvent)),
            'keydown': (e) => this.keyboardDownActions.forEach(action => action(e as KeyboardEvent)),
            'keyup': (e) => this.keyboardUpActions.forEach(action => action(e as KeyboardEvent)),
            'wheel': (e) => this.wheelActions.forEach(action => action(e as WheelEvent)),
        }

        app.ref.addEventListener('pointerdown', this.handlers['pointerdown'])
        app.ref.addEventListener('pointerup', this.handlers['pointerup'])
        app.ref.addEventListener('pointermove', this.handlers['pointermove'])
        window.addEventListener('keydown', this.handlers['keydown'])
        window.addEventListener('keyup', this.handlers['keyup'])
        window.addEventListener('wheel', this.handlers['wheel'])
    }

    destroy(): void {
        app.ref.removeEventListener('pointerdown', this.handlers['pointerdown'])
        app.ref.removeEventListener('pointerup', this.handlers['pointerup'])
        app.ref.removeEventListener('pointermove', this.handlers['pointermove'])
        window.removeEventListener('keydown', this.handlers['keydown'])
        window.removeEventListener('keyup', this.handlers['keyup'])
        window.removeEventListener('wheel', this.handlers['wheel'])
    }
    
    onMouseDown(action: (e: PointerEvent) => any): void {
        this.mouseDownActions.push(action)
    }
    
    onMouseUp(action: (e: PointerEvent) => any): void {
        this.mouseUpActions.push(action)
    }
    
    onMouseMove(action: (e: PointerEvent) => any): void {
        this.mouseMoveActions.push(action)
    }
    
    onKeyboardUp(action: (e: KeyboardEvent) => any): void {
        this.keyboardUpActions.push(action)
    }
    
    onKeyboardDown(action: (e: KeyboardEvent) => any): void {
        this.keyboardDownActions.push(action)
    }

    onWheel(action: (e: WheelEvent) => any): void {
        this.wheelActions.push(action)
    };
}