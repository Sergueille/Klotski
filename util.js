var vec2 = /** @class */ (function () {
    function vec2(x, y) {
        this.x = x;
        this.y = y !== null && y !== void 0 ? y : x;
    }
    vec2.prototype.copy = function () {
        return new vec2(this.x, this.y);
    };
    vec2.prototype.add = function (other) {
        return new vec2(this.x + other.x, this.y + other.y);
    };
    vec2.prototype.sub = function (other) {
        return new vec2(this.x - other.x, this.y - other.y);
    };
    vec2.prototype.mult = function (other) {
        return new vec2(this.x * other, this.y * other);
    };
    vec2.prototype.divide = function (other) {
        return new vec2(this.x / other, this.y / other);
    };
    vec2.prototype.round = function () {
        return new vec2(Math.round(this.x), Math.round(this.y));
    };
    vec2.prototype.isEq = function (other) {
        return this.x === other.x && this.y === other.y;
    };
    return vec2;
}());
function delay(milliseconds) {
    return new Promise(function (resolve) { return setTimeout(resolve, milliseconds); });
}
