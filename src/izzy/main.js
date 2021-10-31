import * as PIXI from 'pixi.js'


class Izzy {
    constructor() {
        this.ref = null
        this.renderer = null
        this.container = new PIXI.Container()
        this.test = PIXI.Texture.from('src/izzy/assets/efficiency.png')
        this.artist = new Artist()
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
        const sprite = PIXI.Sprite.from(this.test)

        sprite.position.set(x, y)
        sprite.anchor.set(0.5)
        // sprite.tint
        // sprite.alpha
        sprite.scale.set(pressure / 10)

        this.container.addChild(sprite)
    }

    update() {
        this.renderer.render(this.container)
        requestAnimationFrame(this.update.bind(this))
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