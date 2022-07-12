import * as PIXI from 'pixi.js'
import { Easing } from '../util'

export class Cursor {
    public container: PIXI.Container = new PIXI.Container()
    private timeout: NodeJS.Timeout

    private fadeDelay = 3000
    private fadeFrameCount = 30
    private fadeFrame = 0

    
    public set x(value: number) {
        this.container.x = value
        if (!this.localCursor) this.startTimeout()
    }
    
    public set y(value: number) {
        this.container.y = value
        if (!this.localCursor) this.startTimeout()
    }

    constructor(public name: string, public color: string, public localCursor: boolean = false) {
        this.container = new PIXI.Container()

        const cursorTag = new PIXI.Container()

        const cursorPaddingX = 10
        const cursorPaddingY = 5

        const cursorText = new PIXI.Text(this.name, { fontFamily: 'system-ui', fontSize: 15, fontWeight: "500" })
        cursorText.x = cursorPaddingX / 2
        cursorText.y = cursorPaddingY / 2

        const cursorBG = new PIXI.Graphics()
            .beginFill(PIXI.utils.string2hex(this.color))
            .drawRoundedRect(0, 0, cursorText.width + cursorPaddingX, cursorText.height + cursorPaddingY, 5)
            .endFill()
            
        const iconSize = 6
        const cursorIcon = new PIXI.Graphics()
            .beginFill(0xFFFFFF)
            .drawCircle(0, 0, iconSize * 1.2)
            .endFill()
            .beginFill(PIXI.utils.string2hex(this.color))
            .drawCircle(0, 0, iconSize)
            .endFill()
            .beginHole()
            .drawCircle(0, 0, iconSize * 0.7)
            .endHole()

        cursorTag.addChild(cursorBG)
        cursorTag.addChild(cursorText)

        cursorTag.y = -cursorTag.height / 2
        cursorTag.x = cursorIcon.width / 2 + 5

        if (!this.localCursor) this.container.addChild(cursorTag)
        this.container.addChild(cursorIcon)
        if (!this.localCursor) this.container.alpha = 0
    }

    private startTimeout() {
        this.container.alpha = 1
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
            this.fadeFrame = 0
            this.fade()
        }, this.fadeDelay)
    }

    private fade() {
        this.container.alpha = Easing.easeInOutQuad(1 - (this.fadeFrame / this.fadeFrameCount))
        this.fadeFrame += 1
        if (this.fadeFrame <= this.fadeFrameCount) requestAnimationFrame(this.fade.bind(this))
    }
}