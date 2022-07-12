import * as PIXI from 'pixi.js'
import { app } from './App'
import type { Canvas } from './Canvas/Canvas'
import { distance, rgb2hex } from './util'

export class Viewport {

    container: PIXI.Container
    private canvas: Canvas

    private scrubbyZoomInitialPoint: { x: number, y: number } = null
    private scrubbyRotateInitialPoint: { x: number, y: number } = null
    private scrubbyRotateInitialRotation: number = null
    private scrubbyRotateInitialCircularRotation: number = null

    private circularRotation: number = 0

    constructor(canvas: Canvas) {
        this.container = new PIXI.Container()
        this.canvas = canvas

        this.container.x = app.application.screen.width / 2
        this.container.y = app.application.screen.height / 2

        this.container.pivot.x = this.canvas.settings.width / 2
        this.container.pivot.y = this.canvas.settings.height / 2

        this.container.addChild(this.canvas.container)

        this.updateMask()
    }

    convertScreenToCanvas(x: number, y: number) {
        return this.container.worldTransform.applyInverse(new PIXI.Point(x, y))
    }

    convertCanvasToScreen(x: number, y: number) {
        return this.container.worldTransform.apply(new PIXI.Point(x, y))
    }

    rotateBy(radians: number) {
        this.rotateTo(this.circularRotation + radians, this.container.rotation + radians)
    }

    rotateTo(circularRotationRadians: number, rotationRadians: number) {
        this.circularRotation = circularRotationRadians

        const pivot = { x: app.application.screen.width / 2, y: app.application.screen.height / 2 }
        const canvasCenter = this.container.toGlobal(this.container.pivot)

        const radius = distance(pivot.x, pivot.y, canvasCenter.x, canvasCenter.y)

        const newPosition = {
            x: radius * Math.cos(this.circularRotation) + pivot.x,
            y: radius * Math.sin(this.circularRotation) + pivot.y
        }

        this.container.position.x = newPosition.x
        this.container.position.y = newPosition.y

        this.container.rotation = rotationRadians

        this.updateMask()
    }

    scrubbyRotateStart(e: MouseEvent) {
        this.scrubbyRotateInitialPoint = { x: e.x, y: e.y }
        this.scrubbyRotateInitialRotation = this.container.rotation
        this.scrubbyRotateInitialCircularRotation = this.circularRotation
    }

    scrubbyRotateUpdate(e: MouseEvent) {
        if (!this.scrubbyRotateInitialPoint) return
        const pivot = { x: app.application.screen.width / 2, y: app.application.screen.height / 2 }
        const rotationDelta = Math.atan2(e.y - pivot.y, e.x - pivot.x) - Math.atan2(this.scrubbyRotateInitialPoint.y - pivot.y, this.scrubbyRotateInitialPoint.x - pivot.x)
        this.rotateTo(this.scrubbyRotateInitialCircularRotation + rotationDelta, this.scrubbyRotateInitialRotation + rotationDelta)
    }

    scrubbyRotateEnd(e: MouseEvent) {

        const near = (value, target, tolerance) => {
            const min = target - tolerance
            const max = target + tolerance
            return value >= min && value <= max
        }

        if (near(Math.abs(this.container.angle % 90), 0, 5) || near(Math.abs(this.container.angle % 90), 90, 5)) {
            app.animator.animate(value => {
                this.container.angle = value
                this.updateMask()
            }, this.container.angle, Math.round(this.container.angle / 90) * 90, 200)
        }

        this.scrubbyRotateInitialPoint = null
        this.scrubbyRotateInitialRotation = null
        this.scrubbyRotateInitialCircularRotation = null
    }

    rotateRight() {
        this.rotateBy(10 * PIXI.DEG_TO_RAD)
    }

    rotateLeft() {
        this.rotateBy(-10 * PIXI.DEG_TO_RAD)
    }

    zoomToPoint(x: number, y: number, scale: number) {
        const worldPos = { x: (x - this.container.x) / this.container.scale.x, y: (y - this.container.y) / this.container.scale.y }
        const newScreenPos = { x: worldPos.x * scale + this.container.x, y: worldPos.y * scale + this.container.y }

        this.container.x -= newScreenPos.x - x
        this.container.y -= newScreenPos.y - y
        this.container.scale.x = scale
        this.container.scale.y = scale


        this.updateRotation()
        this.updateMask()
    }

    wheelZoom(e: WheelEvent) {
        const scale = this.container.scale.x + (-e.deltaY / 1000) * this.container.scale.x
        this.zoomToPoint(e.x, e.y, scale)
    }

    scrubbyZoomStart(e: PointerEvent) {
        this.scrubbyZoomInitialPoint = { x: e.x, y: e.y }
    }

    scrubbyZoomUpdate(e: PointerEvent) {
        if (!this.scrubbyZoomInitialPoint) return
        const scale = this.container.scale.x + (e.movementX / 200) * this.container.scale.x
        this.zoomToPoint(this.scrubbyZoomInitialPoint.x, this.scrubbyZoomInitialPoint.y, scale)
    }

    scrubbyZoomEnd(e: PointerEvent) {
        this.scrubbyZoomInitialPoint = null
    }

    pan(e: PointerEvent) {
        this.container.x += e.movementX
        this.container.y += e.movementY

        this.updateRotation()
        this.updateMask()
    }

    colorAt(e: PointerEvent) {
        const renderTexture = app.renderTexturePool.acquire(app.application.screen.width, app.application.screen.height)
        app.application.renderer.render(app.application.stage, { renderTexture })
        app.renderTexturePool.release(renderTexture)
        
        const canvas = app.application.renderer.plugins.extract.canvas(renderTexture)
        const canvasContext = canvas.getContext("2d")
        const [ r, g, b, _ ] = canvasContext.getImageData(e.x, e.y, 1, 1).data
        
        return rgb2hex({ r, g, b })
    }

    private updateRotation() {
        const pivot = { x: app.application.screen.width / 2, y: app.application.screen.height / 2 }
        const canvasCenter = this.container.toGlobal(this.container.pivot)

        this.circularRotation = Math.atan2(canvasCenter.y - pivot.y, canvasCenter.x - pivot.x)
    }

    private updateMask() {
        const mask = new PIXI.Graphics()
            .beginFill(0xFF0000)
            .drawRect(0, 0, app.canvas.settings.width, app.canvas.settings.height)
            .endFill()

        this.container.transform.updateTransform(app.application.stage.transform)
        mask.transform.setFromMatrix(this.container.transform.worldTransform)

        this.container.mask = mask
    }

    // private applyZoomConstraints() {
    //     if (this.navigation.scale > 5) this.navigation.scale = 5
    //     if (this.navigation.scale <= 0.01) this.navigation.scale = 0.01

    //     if (this.navigation.scale >= 3) PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
    //     if (this.navigation.scale < 3) PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR
    // }
}