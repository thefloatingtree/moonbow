import type { BrushSettings } from "src/models/BrushSettings";
import { ActionManager } from "../Interactions/Actions/ActionManager";
import type { IEventSource } from "../Interactions/Events/IEventSource";
import { LocalEventSource } from "../Interactions/Events/LocalEventSource";
import { ToolManager } from "../Interactions/Tools/ToolManager";

export abstract class Artist {
    public brushSettings: BrushSettings = {
        color: "#03B3FF",
        opacity: 1,
        size: 10,
        spacing: 2,
        tipType: 'circle',
        hardness: 2
    }

    public eraserSettings: BrushSettings = {
        color: "#FFFFFF",
        opacity: 1,
        size: 10,
        spacing: 2,
        tipType: 'circle',
        hardness: 2
    }

    public actionManager: ActionManager
    public toolManager: ToolManager

    constructor(
        public id: string,
        public name: string,
        public owner: boolean,
        public color: string,
        protected eventSource: IEventSource
    ) {
        this.actionManager = new ActionManager(this.eventSource)
        this.toolManager = new ToolManager(this.eventSource)
    }

    abstract destroy(): void
}