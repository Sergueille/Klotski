class vec2 {
    public x: number;
    public y: number;

    constructor(x: number, y?: number) {
        this.x = x;
        this.y = y ?? x;
    }

    copy() {
        return new vec2(this.x, this.y);
    }

    add(other: vec2) {
        return new vec2(this.x + other.x, this.y + other.y);
    }

    sub(other: vec2) {
        return new vec2(this.x - other.x, this.y - other.y);
    }

    mult(other: number) {
        return new vec2(this.x * other, this.y * other);
    }

    divide(other: number) {
        return new vec2(this.x / other, this.y / other);
    }

    round() {
        return new vec2(Math.round(this.x), Math.round(this.y));
    }

    isEq(other: vec2) {
        return this.x === other.x && this.y === other.y;
    }
}

function delay(milliseconds: number) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

