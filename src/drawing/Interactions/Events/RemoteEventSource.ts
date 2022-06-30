import { MessageTypes } from "../../../../server/MessageTypes";
import { app } from "../../App";
import { EventType } from "../Tools/Tool";
import type { IEventSource } from "./IEventSource";

export class RemoteEventSource implements IEventSource {

    private mouseDownActions: Array<(e: PointerEvent) => any> = []
    private mouseUpActions: Array<(e: PointerEvent) => any> = []
    private mouseMoveActions: Array<(e: PointerEvent) => any> = []
    private keyboardUpActions: Array<(e: KeyboardEvent) => any> = []
    private keyboardDownActions: Array<(e: KeyboardEvent) => any> = []
    private wheelActions: Array<(e: WheelEvent) => any> = []

    private handler: (message: any) => void

    constructor(public artistId: string) {
        this.handler = (message) => {
            const { type, body } = message
            if (type === MessageTypes.OnClientEvent &&
                this.artistId === body.client.id &&
                this.artistId !== app.artistManager.localArtist.id
            ) {
                switch (body.event.eventType) {
                    case EventType.onMouseDown:
                        this.mouseDownActions.forEach(action => action(body.event.data))
                        break
                    case EventType.onMouseMove:
                        this.mouseMoveActions.forEach(action => action(body.event.data))
                        break
                    case EventType.onMouseUp:
                        this.mouseUpActions.forEach(action => action(body.event.data))
                        break
                    case EventType.onKeyboardUp:
                        this.keyboardUpActions.forEach(action => action(body.event.data))
                        break
                    case EventType.onKeyboardDown:
                        this.keyboardDownActions.forEach(action => action(body.event.data))
                        break
                    case EventType.onWheel:
                        this.wheelActions.forEach(action => action(body.event.data))
                        break
                }
            }
        }
        app.connection.addMessageListener(this.handler)
    }

    destroy(): void {
        app.connection.removeMessageListener(this.handler)
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