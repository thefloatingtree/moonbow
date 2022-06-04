import * as PIXI from 'pixi.js'

// https://easings.net/
export const Easing = {
    linear: x => x,
    easeInQuad: x => x * x,
    easeOutQuad: x => 1 - (1 - x) * (1 - x),
    easeInOutQuad: x => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2,
    easeInCubic: x => x * x * x,
    easeOutCubic: x => 1 - Math.pow(1 - x, 3),
    easeInOutCubic: x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
    easeInQuart: x => x * x * x * x,
    easeOutQuart: x => 1 - Math.pow(1 - x, 4),
    easeInOutQuart: x => x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2,
    easeInQuint: x => x * x * x * x * x,
    easeOutQuint: x => 1 - Math.pow(1 - x, 5),
    easeInOutQuint: x => x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2,
    easeInExpo: x => x === 0 ? 0 : Math.pow(2, 10 * x - 10),
    easeOutExpo: x => x === 1 ? 1 : 1 - Math.pow(2, -10 * x),
    easeInOutExpo: x => x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2,
    easeInCirc: x => 1 - Math.sqrt(1 - Math.pow(x, 2)),
    easeOutCirc: x => Math.sqrt(1 - Math.pow(x - 1, 2)),
    easeInOutCirc: x => x < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2,
    easeInBack: x => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return c3 * x * x * x - c1 * x * x;
    },
    easeOutBack: x => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    },
    easeInOutBack: x => {
        const c1 = 1.70158;
        const c2 = c1 * 1.525;
        return x < 0.5
            ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
            : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
    }
}

export function clamp(value, min, max) {
    if (value < min) return min
    if (value > max) return max
    return value
}

export function lerp(start: number, end: number, percent: number) {
    return start * (1 - percent) + end * percent
}

// https://devblogs.microsoft.com/cppblog/project-austin-part-3-of-6-ink-smoothing/
export function cardinalSpline(t: number, L: number, p1: { x: number, y: number }, p2: { x: number, y: number }, p3: { x: number, y: number }, p4: { x: number, y: number }) {
    const x = (2 * t ** 3 - 3 * t ** 2 + 1) * p2.x + (-2 * t ** 3 + 3 * t ** 2) * p3.x + (t ** 3 - 2 * t ** 2 + t) * L * (p3.x - p1.x) + (t ** 3 - t ** 2) * L * (p4.x - p2.x)
    const y = (2 * t * t * t - 3 * t * t + 1) * p2.y + (-2 * t * t * t + 3 * t * t) * p3.y + (t * t * t - 2 * t * t + t) * L * (p3.y - p1.y) + (t * t * t - t * t) * L * (p4.y - p2.y)
    return { x, y }
}

export function magnitude(x: number, y: number): number {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
}

export function distance(x1: number, y1: number, x2: number, y2: number){
    let y = x2 - x1;
    let x = y2 - y1;
    
    return Math.sqrt(x * x + y * y);
}

export class Matrix extends PIXI.Matrix {

    static CreateTranslation(x: number, y: number): Matrix {
        const matrix = new Matrix()
        if (x === 0 && y === 0) return matrix

        matrix.tx = x
        matrix.ty = y

        return matrix
    }

    static CreateRotation(radians: number, pivotX: number, pivotY: number): Matrix {
        const matrix = new Matrix()

        if (radians === 0) return matrix

        const sin = Math.sin(radians)
        const cos = Math.cos(radians)

        const onMinusCos = 1 - cos

        matrix.a = cos
        matrix.b = sin
        matrix.c = -sin
        matrix.d = cos
        matrix.tx = this.Dot(sin, pivotY, onMinusCos, pivotX)
        matrix.ty = this.Dot(-sin, pivotX, onMinusCos, pivotY)

        return matrix
    }

    static CreateScale(scaleX: number, scaleY: number, pivotX: number, pivotY: number): Matrix {
        const matrix = new Matrix()

        if (scaleX === 1 && scaleY === 1) return matrix

        const tx = pivotX - scaleX * pivotX
        const ty = pivotY - scaleY * pivotY

        matrix.a = scaleX
        matrix.d = scaleY
        matrix.tx = tx
        matrix.ty = ty
        
        return matrix
    }

    static Dot(a: number, b: number, c: number, d: number): number {
        return a * b + c * d
    }
}