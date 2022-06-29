import type { BrushSettings } from "src/models/BrushSettings";
import { ActionManager } from "../Actions/ActionManager";
import { ToolManager } from "../Tools/ToolManager";

export class Artist {
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
        public color: string
    ) {
        this.actionManager = new ActionManager()
        this.toolManager = new ToolManager()
    }
}