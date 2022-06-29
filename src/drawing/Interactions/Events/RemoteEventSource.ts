import type { IEventSource } from "./IEventSource";

export class RemoteEventSource implements IEventSource {
    private mouseDownAction: (e: PointerEvent) => any = () => {}
    private mouseUpAction: (e: PointerEvent) => any = () => {}
    private mouseMoveAction: (e: PointerEvent) => any = () => {}
    private keyboardUpAction: (e: KeyboardEvent) => any = () => {}
    private keyboardDownAction: (e: KeyboardEvent) => any = () => {}
    private wheelAction: (e: WheelEvent) => any = () => {}

    constructor() {
        // app.ref.addEventListener('pointerdown', (e) => this.mouseDownAction(e))
        // app.ref.addEventListener('pointerup', (e) => this.mouseUpAction(e))
        // app.ref.addEventListener('pointermove', (e) => this.mouseMoveAction(e))
        // window.addEventListener('keyup', (e) => this.keyboardUpAction(e))
        // window.addEventListener('keydown', (e) => this.keyboardDownAction(e))
        // window.addEventListener('wheel', (e) => this.wheelAction(e))
    }

    destroy(): void {

    }
    
    onMouseDown(action: (e: PointerEvent) => any): void {
        this.mouseDownAction = action
    }
    
    onMouseUp(action: (e: PointerEvent) => any): void {
        this.mouseUpAction = action
    }
    
    onMouseMove(action: (e: PointerEvent) => any): void {
        this.mouseMoveAction = action
    }
    
    onKeyboardUp(action: (e: KeyboardEvent) => any): void {
        this.keyboardUpAction = action
    }
    
    onKeyboardDown(action: (e: KeyboardEvent) => any): void {
        this.keyboardDownAction = action
    }

    onWheel(action: (e: WheelEvent) => any): void {
        this.wheelAction = action
    };
}