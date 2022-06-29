export class IEventSource {
    onMouseDown: (action: (e: PointerEvent) => any) => void
    onMouseUp: (action: (e: PointerEvent) => any) => void
    onMouseMove: (action: (e: PointerEvent) => any) => void
    onKeyboardUp: (action: (e: KeyboardEvent) => any) => void
    onKeyboardDown: (action: (e: KeyboardEvent) => any) => void
    onWheel: (action: (e: WheelEvent) => any) => void

    destroy: () => void
}