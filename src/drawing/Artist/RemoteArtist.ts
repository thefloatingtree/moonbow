import { brushColor } from "../../../src/lib/stores/brushSettings";
import { app } from "../App";
import { OnDownTriggerAction, OnUpTriggerAction, OnHoldReleaseTriggerAction } from "../Interactions/Actions/Actions";
import { RemoteEventSource } from "../Interactions/Events/RemoteEventSource";
import { ToolType } from "../Interactions/Tools/ToolTypes";
import { Artist } from "./Artist";

export class RemoteArtist extends Artist {
    constructor(id: string, color: string) {
        super(id, color, new RemoteEventSource(id))

        this.addActions()
        this.addTools()
    }

    destroy(): void {
        this.eventSource.destroy()
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
                    app.canvas.startBrushStroke(e)
                }
            })
            .onMouseMove((e: PointerEvent) => {
                app.canvas.updateBrushStrokeWithPointInCanvasSpace(e)
            })
            .onMouseUp((e: PointerEvent) => {
                if (e.button === 0) {
                    app.canvas.endBrushStroke(e)
                }
            })
        this.toolManager.addTool(ToolType.Eraser)
            .onMouseDown((e: PointerEvent) => {
                if (e.button === 0) app.canvas.startBrushStroke(e, true)
            })
            .onMouseMove((e: PointerEvent) => {
                app.canvas.updateBrushStrokeWithPointInCanvasSpace(e, true)
            })
            .onMouseUp((e: PointerEvent) => {
                if (e.button === 0) app.canvas.endBrushStroke(e, true)
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