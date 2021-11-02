import * as PIXI from 'pixi.js'
import { SmoothStroke } from './SmoothStroke'
import { lerp } from './util'


class Izzy {
    constructor() {
        this.ref = null
        this.renderer = null
        this.container = new PIXI.Container()
        this.test = PIXI.Texture.from('src/izzy/assets/efficiency.png')
        this.artist = new Artist()

        this.width = null
        this.height = null

        this.liveBrushStroke = null
    }

    init(canvasRef, { width = 800, height = 600 } = {}) {
        this.ref = canvasRef

        this.width = width
        this.height = height

        this.renderer = new PIXI.autoDetectRenderer({
            view: this.ref,
            width,
            height,
            backgroundColor: 0x000000, 
            antialias: false 
        })

        this.artist.init(this)

        this.update()
    }

    addBrushNode(x, y, pressure) {
        this.liveBrushStroke.addNode({ x, y, pressure })
    }

    beginBrushStroke() {
        this.liveBrushStroke = new BrushStroke(this.test)
        this.container.addChild(this.liveBrushStroke.container)
    }

    endBrushStroke() {

        // console.time('renderStroke')
        // console.log(this.liveBrushStroke.container.children.length)
        const renderTexture = PIXI.RenderTexture.create({
            width: this.width,
            height: this.height
        })
        this.renderer.render(this.liveBrushStroke.container, { renderTexture })

        const sprite = new PIXI.Sprite(renderTexture)
        
        this.container.removeChild(this.liveBrushStroke.container)
        this.container.addChild(sprite)
        // console.timeEnd('renderStroke')
    }

    update() {
        this.renderer.render(this.container)
        requestAnimationFrame(this.update.bind(this))
    }
}

class BrushStroke {
    constructor(brushTip) {
        // this.path = new paper.Path()
        this.container = new PIXI.Container()
        this.brushTip = brushTip
        this.smoothStroke = new SmoothStroke()

        this.lastPressure = 0
    }

    addNode({ x, y, pressure } = {}) {
        
        // console.time('addNode')
        const points = this.smoothStroke.addPoint(x, y)
        for (let i = 0; i < points.length; i++) {
            const point = points[i]

            const interpolatedPressure = lerp(this.lastPressure, pressure, i / points.length)
            const actualPressure = points.length === 1 ? pressure : interpolatedPressure

            const sprite = PIXI.Sprite.from(this.brushTip)
            sprite.position.set(point.x, point.y)
            sprite.anchor.set(0.5)
            // sprite.tint
            // sprite.alpha
            sprite.scale.set(actualPressure / 50)
            this.container.addChild(sprite)
        }
        this.lastPressure = pressure
        // console.timeEnd('addNode')

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
        this.canvas.ref.addEventListener('pointerdown', (e) => {
            this.pointerDown = true
            this.canvas.beginBrushStroke()
            this.canvas.addBrushNode(e.clientX, e.clientY, e.pressure)
        })
        this.canvas.ref.addEventListener('pointerup', () => {
            this.pointerDown = false
            this.canvas.endBrushStroke()
        })
        this.canvas.ref.addEventListener('pointermove', (e) => {
            if (this.pointerDown) {
                this.canvas.addBrushNode(e.clientX, e.clientY, e.pressure)
            }
        })
    }
}

export const izzy = new Izzy() // Export as singleton