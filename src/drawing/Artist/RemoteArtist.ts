import { MessageTypes } from "../../../server/MessageTypes";
import { brushColor } from "../../../src/lib/stores/brushSettings";
import { app } from "../App";
import { Cursor } from "../Cursor/Cursor";
import { OnDownTriggerAction, OnUpTriggerAction, OnHoldReleaseTriggerAction } from "../Interactions/Actions/Actions";
import { RemoteEventSource } from "../Interactions/Events/RemoteEventSource";
import { EventType } from "../Interactions/Tools/Tool";
import { ToolType } from "../Interactions/Tools/ToolTypes";
import { Artist } from "./Artist";

export class RemoteArtist extends Artist {

    private cursor: Cursor

    constructor(id: string, name: string, owner: boolean, color: string) {
        super(id, name, owner, color, new RemoteEventSource(id))

        this.cursor = new Cursor(name, color)

        if (app.artistManager.localArtist.id && app.artistManager.localArtist.id !== this.id) {
            app.application.stage.addChild(this.cursor.container)
        }

        this.addActions()
        this.addTools()

        this.setupRemote()
    }

    destroy(): void {
        app.application.stage.removeChild(this.cursor.container)
        this.eventSource.destroy()
        app.connection.removeMessageListener(this.handleToolChangeEvent.bind(this))
    }

    private handleToolChangeEvent(message: any) {
        const { type, body } = message
        if (type === MessageTypes.OnClientEvent &&
            this.id === body.client.id &&
            this.id !== app.artistManager.localArtist.id
        ) {
            if (body.event.eventType === EventType.onMouseMove) {
                const { x, y } = body.event.data

                const converted = app.viewport.convertCanvasToScreen(x, y)

                this.cursor.x = converted.x
                this.cursor.y = converted.y
            }
        }
        if (type === MessageTypes.OnClientToolUpdate &&
            this.id === body.client.id &&
            this.id !== app.artistManager.localArtist.id
        ) {
            switch (body.event.eventType) {
                case 'TOOL_TYPE_CHANGE':
                    this.toolManager.selectTool(body.event.data.toolType)
                    break
                case 'BRUSH_SETTINGS_CHANGE':
                    this.brushSettings = body.event.data.brushSettings
                    break
                case 'ERASER_SETTINGS_CHANGE':
                    this.eraserSettings = body.event.data.eraserSettings
                    break
            }
        }
    }

    private setupRemote() {
        app.connection.addMessageListener(this.handleToolChangeEvent.bind(this))
    }

    private addActions() {
        // navigation
        // pan
        this.actionManager.addAction(new OnDownTriggerAction([' '], () => this.toolManager.selectTool(ToolType.None)))
        this.actionManager.addAction(new OnUpTriggerAction([' '], () => this.toolManager.selectPreviousTool()))
        this.actionManager.addAction(new OnDownTriggerAction(['mousemiddle'], () => this.toolManager.selectTool(ToolType.None)))
        this.actionManager.addAction(new OnUpTriggerAction(['mousemiddle'], () => this.toolManager.selectPreviousTool()))

        // zoom
        this.actionManager.addAction(new OnDownTriggerAction(['z'], () => this.toolManager.selectTool(ToolType.None)))
        this.actionManager.addAction(new OnHoldReleaseTriggerAction(['z'], () => this.toolManager.selectPreviousTool()))
        // rotate
        this.actionManager.addAction(new OnDownTriggerAction(['r'], () => this.toolManager.selectTool(ToolType.None)))
        this.actionManager.addAction(new OnHoldReleaseTriggerAction(['r'], () => this.toolManager.selectPreviousTool()))
        this.actionManager.addAction(new OnDownTriggerAction(['arrowleft'], () => app.viewport.rotateLeft()))
        this.actionManager.addAction(new OnDownTriggerAction(['arrowright'], () => app.viewport.rotateRight()))
        // tools
        this.actionManager.addAction(new OnUpTriggerAction(['b'], () => this.toolManager.selectTool(ToolType.Brush)))
        this.actionManager.addAction(new OnUpTriggerAction(['e'], () => this.toolManager.selectTool(ToolType.Eraser)))
        this.actionManager.addAction(new OnDownTriggerAction(['alt'], () => this.toolManager.selectTool(ToolType.Eyedropper)))
        this.actionManager.addAction(new OnUpTriggerAction(['alt'], () => this.toolManager.selectPreviousTool()))
    }

    private addTools() {
        // painting
        this.toolManager.addTool(ToolType.Brush)
            .onMouseDown((e: PointerEvent) => {
                if (e.button === 0) {
                    app.canvas.startBrushStroke(e, this)
                }
            })
            .onMouseMove((e: PointerEvent) => {
                app.canvas.updateBrushStrokeWithPointInCanvasSpace(e, this)
            })
            .onMouseUp((e: PointerEvent) => {
                if (e.button === 0) {
                    app.canvas.endBrushStroke(e, this)
                }
            })
        this.toolManager.addTool(ToolType.Eraser)
            .onMouseDown((e: PointerEvent) => {
                if (e.button === 0) app.canvas.startBrushStroke(e, this, true)
            })
            .onMouseMove((e: PointerEvent) => {
                app.canvas.updateBrushStrokeWithPointInCanvasSpace(e, this, true)
            })
            .onMouseUp((e: PointerEvent) => {
                if (e.button === 0) app.canvas.endBrushStroke(e, this, true)
            })

        // other tools
        this.toolManager.addTool(ToolType.Eyedropper)
            .onMouseUp(e => {
                const hex = app.viewport.colorAt(e)
                brushColor.set(hex)
            })

        this.toolManager.selectTool(ToolType.Brush)
    }
}