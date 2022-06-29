import { cardinalSpline, lerp } from "../util"
import { Point } from "./Point"

export class SmoothStroke {
    private points = []

    constructor(public spacing: number = 2) { }

    addPoint(x: number, y: number) {
        this.points.push(new Point(x, y))

        const A = this.points.at(-1)
        const B = this.points.at(-2)
        const C = this.points.at(-3)
        const D = this.points.at(-4)

        if (this.points.length === 1) return this.dot(A)
        if (this.points.length === 2 || this.points.length === 3) return this.line(A, B)

        return this.curve(A, B, C, D)
    }

    private dot(point: Point) {
        return [point]
    }

    private line(A: Point, B: Point) {
        const distance = A.distanceTo(B)
        const steps = distance * this.spacing

        const interpolatedPoints = []
        for (let i = 0; i < steps; i++) {
            const x = lerp(A.x, B.x, i / (steps - 1))
            const y = lerp(A.y, B.y, i / (steps - 1))
            interpolatedPoints.push({ x, y })
        }
        return interpolatedPoints
    }

    private curve(A: Point, B: Point, C: Point, D: Point) {
        const distance = B.distanceTo(C)
        const steps = Math.floor(distance * this.spacing)
        const interpolatedPoints = []
        for (let i = 0; i < steps; i++) {
            // const point = { x: lerp(B.x, C.x, i / (steps - 1)), y: lerp(B.y, C.y, i / (steps - 1)) }
            const point = cardinalSpline(i / (steps), 0.5, A, B, C, D)
            interpolatedPoints.push(point)
        }
        return interpolatedPoints
    }
}