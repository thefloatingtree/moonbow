import type { IEventSource } from "../Events/IEventSource"
import { EventType, Tool } from "./Tool"
import type { ToolType } from "./ToolTypes"

export class ToolManager {
    private tools: Map<ToolType, Tool> = new Map()

    private activeTool: Tool
    private previousActiveTool: Tool

    private selectToolCallbacks: Array<(type: ToolType) => any> = []
 
    constructor(private eventSource: IEventSource) {
        this.eventSource.onMouseDown((e) => {
            this.runActiveTool(EventType.onMouseDown, e)
        })
        this.eventSource.onMouseUp((e) => {
            this.runActiveTool(EventType.onMouseUp, e)
        })
        this.eventSource.onMouseMove((e) => {
            this.runActiveTool(EventType.onMouseMove, e)
        })
        this.eventSource.onKeyboardUp((e) => {
            this.runActiveTool(EventType.onKeyboardUp, e)
        })
        this.eventSource.onKeyboardDown((e) => {
            this.runActiveTool(EventType.onKeyboardDown, e)
        })
        this.eventSource.onWheel((e) => {
            this.runActiveTool(EventType.onWheel, e)
        })
    }

    addTool(name: ToolType, alwaysActive: boolean = false) {
        const tool = new Tool(name, alwaysActive)
        this.tools.set(name, tool)
        return tool
    }
 
    selectTool(name: ToolType) {
        if (this.activeTool && this.activeTool.name !== name) {
            this.previousActiveTool = this.activeTool
        }
        this.activeTool = this.tools.get(name)
        this.runActiveTool(EventType.onActivate, new Event('Tool Activated'))

        this.selectToolCallbacks.forEach(fn => fn(name))
    }
 
    onSelectTool(fn: (type: ToolType) => any) {
        this.selectToolCallbacks.push(fn)
    }

    selectedTool(): ToolType {
        return this.activeTool.name;
    }

    selectPreviousTool() {
        this.selectTool(this.previousActiveTool.name)
    }

    runActiveTool(eventType: EventType, event: Event) {
        this.tools.forEach(tool => {
            if (tool.name === this.activeTool?.name || tool.alwaysActive) {
                tool.actions.forEach(action => {
                    if (action.event == eventType) {
                        action.action(event)
                    }
                })
            }
        })
    }
}