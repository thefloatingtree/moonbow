import { app } from "./App"
import { EventType, Tool } from "./Tool"

export class ToolManager {

    private keyboard: Object = {}
    private tools: Map<string, Tool> = new Map()

    private activeTool: Tool

    constructor() {
        this.setupEvents()
    }

    addTool(name) {
        const tool = new Tool(name)
        this.tools.set(name, tool)
        return tool
    }

    selectTool(name) {
        this.activeTool = this.tools.get(name)
        this.runActiveTool(EventType.onActivate, new Event('Tool Activated'))
    }

    runActiveTool(eventType: EventType, event: Event) {
        this.activeTool?.actions.forEach(action => {
            if (action.event == eventType) {
                action.action(event)
            }
        })
    }

    setupEvents() {
        app.ref.addEventListener('pointerdown', (e) => {
            this.runActiveTool(EventType.onMouseDown, e)
        })
        app.ref.addEventListener('pointerup', (e) => {
            this.runActiveTool(EventType.onMouseUp, e)
        })
        app.ref.addEventListener('pointermove', (e) => {
            this.runActiveTool(EventType.onMouseMove, e)
        })
        window.addEventListener('keyup', (e) => {
            this.keyboard[e.key] = false
            this.runActiveTool(EventType.onKeyboardUp, e)
        })

        window.addEventListener('keydown', (e) => {
            this.keyboard[e.key] = true
            this.runActiveTool(EventType.onKeyboardDown, e)
        })
    }
}