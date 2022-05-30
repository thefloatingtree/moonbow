export class Action {

    constructor(protected shortcut: Array<string>, protected action: Function) {}

    protected allPressed(keyboard: Object) {
        return this.shortcut.reduce((acc, key) => acc && keyboard[key], true)
    }

    public onDown(keyboard: Object): void {}
    public onUp(keyboard: Object): void {}
}

export class OnDownTriggerAction extends Action {
    onDown(keyboard: Object) {
        if (this.allPressed(keyboard)) {
            this.action()
        }
    }
}

export class OnUpTriggerAction extends Action {

    private wasPressed: boolean = false

    onDown(keyboard: Object) {
        if (this.allPressed(keyboard)) {
            this.wasPressed = true
        }
    }

    onUp(keyboard: Object) {
        if (this.wasPressed && !this.allPressed(keyboard)) {
            this.wasPressed = false
            this.action()
        } 
    }
}

export class OnHoldReleaseTriggerAction extends Action {
    
    private timer: NodeJS.Timeout
    private shouldRunAction: boolean = false
    private held: boolean = false
    private holdTime: number = 200

    onDown(keyboard: Object) {
        if (this.held) return
        if (this.allPressed(keyboard)) {
            this.timer = setTimeout(() => {
                this.shouldRunAction = true
            }, this.holdTime)
            this.held = true
        }
    }

    onUp(keyboard: Object) {
        const allPressed = this.shortcut.reduce((acc, key) => acc && keyboard[key], true)
        if (!allPressed) {

            if (this.shouldRunAction) {
                this.action()
            }
            
            this.held = false
            this.shouldRunAction = false
            clearTimeout(this.timer)
        }
    }
}