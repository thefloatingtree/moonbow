import * as PIXI from 'pixi.js'
import { app } from './App'

export class Grid {
    public container: PIXI.Container = new PIXI.Container()

    constructor() {
        this.constructLines()

        window.addEventListener('resize', (e) => {
            console.log(e)
            this.constructLines()
        })
    }

    private constructLines() {
        const width = window.innerWidth
        const height = window.innerHeight

        const cellSize = 20

        const rows = height / cellSize
        const columns = width / cellSize

        const lines = new PIXI.Graphics()

        for (let x = 1; x <= columns; x++) {
            lines.lineStyle(2, 0x2C2C2C)
            lines.moveTo(x * cellSize, 0)
            lines.lineTo(x * cellSize, height)
        }

        for (let y = 1; y <= rows; y++) {
            lines.lineStyle(2, 0x2C2C2C)
            lines.moveTo(0, y * cellSize)
            lines.lineTo(width, y * cellSize)
        }

        this.container.removeChildren()
        this.container.addChild(lines)
    }
}