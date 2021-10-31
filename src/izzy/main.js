import { Path, Point, Project } from 'paper/dist/paper-core'
import * as PIXI from 'pixi.js'


class Izzy {
    constructor() {
        this.ref = null
        this.renderer = null
        this.container = new PIXI.Container()
        this.test = PIXI.Texture.from('src/izzy/assets/efficiency.png')
        this.artist = new Artist()

        this.paperProject = new Project() // This is required for all paper.js objects to work despite not using paper.js's visualiztion tools

        this.liveBrushStroke = null
    }

    init(canvasRef, { width = 800, height = 600 } = {}) {
        this.ref = canvasRef
        this.renderer = new PIXI.autoDetectRenderer({
            view: this.ref,
            width,
            height,
            backgroundColor: 0x000000
        })

        this.artist.init(this)

        this.update()
    }

    addBrushNode(x, y, pressure) {
        // const sprite = PIXI.Sprite.from(this.test)

        // sprite.position.set(x, y)
        // sprite.anchor.set(0.5)
        // // sprite.tint
        // // sprite.alpha
        // sprite.scale.set(pressure / 10)

        // this.container.addChild(sprite)
        this.liveBrushStroke.addNode({ x, y, pressure })
    }

    beginBrushStroke() {
        this.liveBrushStroke = new BrushStroke(this.test)
        this.container.addChild(this.liveBrushStroke.container)
    }

    update() {
        this.renderer.render(this.container)
        requestAnimationFrame(this.update.bind(this))
    }
}

class BrushStroke {
    constructor(brushTip) {
        this.path = new Path()
        this.rawPoints = []
        this.bezierPoints = []
        this.points = []
        this.container = new PIXI.Container()
        this.brushTip = brushTip

        this.mostRecentPoint = null

        this.pressure = 0.01
    }

    addNode({ x, y, pressure } = {}) {

        const lastIndex = this.path.length

        this.path.add(new Point(x, y))
        this.path.smooth({ type: 'catmull-rom', factor: 0.4 })

        for (let i = lastIndex; i < this.path.length; i++) {
            const point = this.path.getPointAt(i)

            const sprite = PIXI.Sprite.from(this.brushTip)
            sprite.position.set(point.x, point.y)
            sprite.anchor.set(0.5)
            // sprite.tint
            // sprite.alpha
            sprite.scale.set(this.pressure / 10)
            this.container.addChild(sprite)
        }

        this.pressure = this.pressure <= 1 ? this.pressure + 0.01 : 1
    }
}

class Artist {
    constructor() {
        this.pointerDown = false
        this.canvas = null
    }

    init(canvas) {
        this.canvas = canvas

        // Add event listners
        this.canvas.ref.addEventListener('pointerdown', () => {
            this.pointerDown = true
            this.canvas.beginBrushStroke()
        })
        this.canvas.ref.addEventListener('pointerup', () => {
            this.pointerDown = false
        })
        this.canvas.ref.addEventListener('pointermove', (e) => {
            if (this.pointerDown) {
                this.canvas.addBrushNode(e.clientX, e.clientY, e.pressure)
            }
        })
    }
}

export const izzy = new Izzy() // Export as singleton