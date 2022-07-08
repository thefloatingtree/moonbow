import type { BrushSettings } from "src/models/BrushSettings";
import { app } from "../App";
import { ActionManager } from "../Interactions/Actions/ActionManager";
import type { IEventSource } from "../Interactions/Events/IEventSource";
import { LocalEventSource } from "../Interactions/Events/LocalEventSource";
import { ToolManager } from "../Interactions/Tools/ToolManager";

export abstract class Artist {
    public brushSettings: BrushSettings
    public eraserSettings: BrushSettings

    public actionManager: ActionManager
    public toolManager: ToolManager

    constructor(
        public id: string,
        public name: string,
        public owner: boolean,
        public color: string,
        protected eventSource: IEventSource
    ) {
        this.brushSettings = app.canvas.defaultBrushSettings 
        this.eraserSettings = app.canvas.defaultEraserSettings 

        this.actionManager = new ActionManager(this.eventSource)
        this.toolManager = new ToolManager(this.eventSource)
    }

    abstract destroy(): void
}