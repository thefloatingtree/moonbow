import * as PIXI from 'pixi.js'
import { app } from './App'
import type { Canvas } from './Canvas'

export class Viewport {

    container: PIXI.Container
    canvas: Canvas

    navigation = {
        scale: 1,
        rotation: 0,
        offset: { x: 0, y: 0 }
    }


    constructor(canvas: Canvas) {
        this.container = new PIXI.Container()
        this.canvas = canvas

        this.container.addChild(this.canvas.container) 

        this.container.setTransform(app.application.screen.width / 2, app.application.screen.height / 2, 1, 1, 0, 0, 0, this.canvas.settings.width / 2, this.canvas.settings.height / 2)
    }

    private updateContainerTransform() {
        this.container.setTransform(
            app.application.screen.width / 2, 
            app.application.screen.height / 2,
            this.navigation.scale, 
            this.navigation.scale,
            this.navigation.rotation,
            0, 
            0,
            this.canvas.settings.width / 2 + (this.navigation.offset.x / this.navigation.scale),
            this.canvas.settings.height / 2 + (this.navigation.offset.y / this.navigation.scale)
        )
    }

    convertScreenToCanvas(x, y) {
        return this.container.transform.worldTransform.applyInverse(new PIXI.Point(x, y))
    }

    zoomIn() {

    }

    zoomOut() {

    }

    rotateLeft() {
        this.navigation.rotation -= 0.1
        this.updateContainerTransform()
    }

    rotateRight() {
        this.navigation.rotation += 0.1
        this.updateContainerTransform()
    }

    zoom(e: PointerEvent) {
        this.navigation.scale += e.movementX / 100
        if (this.navigation.scale > 5) this.navigation.scale = 5
        if (this.navigation.scale <= 0.01) this.navigation.scale = 0.01

        if (this.navigation.scale >= 3) PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
        if (this.navigation.scale < 3) PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR

        this.updateContainerTransform()
    }

    pan(e: PointerEvent) {
        this.navigation.offset.x += -e.movementX
        this.navigation.offset.y += -e.movementY
        this.updateContainerTransform()
    }

    rotate() {

    }
}