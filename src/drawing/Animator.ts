import * as PIXI from 'pixi.js'
import { clamp, Easing, lerp } from "./util"

class Animation {

    public elapsedMs: number = 0

    constructor(public callback: (value: number) => void, public start: number, public end: number, public duration: number, public easing: (x: number) => number) {  }

    public completed() {
        return this.elapsedMs >= this.duration
    }
}

export class Animator {

    private currentId = -1
    private animations: Map<number, Animation> = new Map()

    public animate(callback: (value: number) => void, start: number, end: number, duration: number, easing = Easing.easeInOutCubic): number {
        this.currentId += 1
        this.animations.set(this.currentId, new Animation(callback, start, end, duration, easing))
        return this.currentId
    }

    public cancelAnimation(id: number) {
        this.animations.delete(id)
    }

    public tick(dt: number) {
        const ms = dt / PIXI.settings.TARGET_FPMS

        this.animations.forEach((animation, key) => {
            if (animation.completed()) return this.animations.delete(key)

            animation.elapsedMs = clamp(animation.elapsedMs + ms, 0, animation.duration)
            const position = animation.elapsedMs / animation.duration
            const value = lerp(animation.start, animation.end, animation.easing(position))
            animation.callback(value)
        })
    }
}