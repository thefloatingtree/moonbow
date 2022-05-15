export class Action {
    constructor(private shortcut: Array<string>, private action: Function) { }

    match(keyboard: Object) {
        const matchAll = this.shortcut.reduce((acc, key) => acc && keyboard[key], true)
        if (matchAll) {
            this.action()
        }
    }
}