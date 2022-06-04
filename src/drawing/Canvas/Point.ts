export class Point {
    constructor(
        public x: number,
        public y: number
    ) { }

    distanceTo(point: Point) {
        return Math.sqrt((point.x - this.x) ** 2 + (point.y - this.y) ** 2)
    }
}