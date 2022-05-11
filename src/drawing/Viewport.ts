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

    keyboard: Object = {}

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

    setupEvents() {
        window.addEventListener('mousemove', (e) => {
            // Keyboard Zoom
            if (this.keyboard['z'] && e.buttons) {
                this.navigation.scale += e.movementX / 100
                if (this.navigation.scale > 5) this.navigation.scale = 5
                if (this.navigation.scale <= 0.01) this.navigation.scale = 0.01
                this.updateContainerTransform()
            }

            // Keyboard Pan
            if (this.keyboard[' '] && e.buttons) {
                this.navigation.offset.x += -e.movementX
                this.navigation.offset.y += -e.movementY
                this.updateContainerTransform()
            }
        })
        
        window.addEventListener('keyup', (e) => {
            this.keyboard[e.key] = false
        })
        
        window.addEventListener('keydown', (e) => {
            this.keyboard[e.key] = true

            // Keyboard Rotate
            if (this.keyboard['ArrowLeft']) {
                this.navigation.rotation -= 0.1
                this.updateContainerTransform()
            } else if (this.keyboard['ArrowRight']) {
                this.navigation.rotation += 0.1
                this.updateContainerTransform()
            }
        })
    }
}