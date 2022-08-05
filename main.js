// A tile that can be moved by the player
var Block = /** @class */ (function () {
    function Block(pos, size, isExit) {
        if (isExit === void 0) { isExit = false; }
        var _this = this;
        this.size = size;
        this.isExit = this.isExit;
        // Create element
        this.element = document.createElement("div");
        this.element.classList.add("block");
        this.element.draggable = true;
        area.appendChild(this.element);
        // Set scale
        this.element.style.width = (this.size.x * tileSize) + "px";
        this.element.style.height = (this.size.y * tileSize) + "px";
        // Set color
        if (isExit) {
            this.element.style.backgroundColor = "#502020";
        }
        else {
            var randColorVal = Math.round(Math.random() * (45 - 30) + 30);
            this.element.style.backgroundColor = "#" + randColorVal.toString() + randColorVal.toString() + randColorVal.toString();
        }
        // Assign events
        this.element.addEventListener("dragstart", function (ev) { return _this.onStartDrag(_this, ev); });
        this.element.addEventListener("dragend", function (ev) { return _this.onEndDrag(_this, ev); });
        // Ste positon
        this.setPos(pos);
    }
    // Set tile position and update visual positon
    Block.prototype.setPos = function (newPos) {
        this.pos = newPos.copy();
        this.setVisualPos(newPos);
    };
    // Set visual position, in tiles
    Block.prototype.setVisualPos = function (newPos) {
        this.element.style.left = (newPos.x * tileSize) + 5 + "px";
        this.element.style.top = (newPos.y * tileSize) + 5 + "px";
    };
    // Set visual position, in pixels
    Block.prototype.setVisualPixelPos = function (newPos) {
        this.element.style.left = (newPos.x) + 5 + "px";
        this.element.style.top = (newPos.y) + 5 + "px";
    };
    // Get tile position
    Block.prototype.getPos = function () {
        return this.pos.copy();
    };
    // Get element positioons, in pixels
    Block.prototype.getPixelPos = function () {
        return new vec2(this.element.offsetLeft - 5, this.element.offsetTop - 5);
    };
    // Called by event (in constructor)
    Block.prototype.onStartDrag = function (obj, event) {
        var _a;
        draggedBlock = obj;
        obj.dragStartMousePos = new vec2(event.screenX, event.screenY);
        obj.dragStartPixelPos = obj.getPixelPos();
        obj.dragDirection = null;
        obj.element.style.transition = "none";
        (_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.setDragImage(new Image(), 0, 0);
    };
    // Called by event (in constructor)
    Block.prototype.onDrag = function (obj, event) {
        var mousePos = new vec2(event.screenX, event.screenY);
        var delta = mousePos.sub(obj.dragStartMousePos);
        if (obj.dragDirection === null)
            obj.dragDirection = Math.abs(delta.y) > Math.abs(delta.x);
        var newPixelPos;
        if (obj.dragDirection) {
            delta.x = 0;
            newPixelPos = obj.dragStartPixelPos.add(delta);
            var min = this.getMaxWithDir(new vec2(0, -1));
            var max = this.getMaxWithDir(new vec2(0, 1));
            if (newPixelPos.y > max.y)
                newPixelPos.y = max.y;
            if (newPixelPos.y < min.y)
                newPixelPos.y = min.y;
        }
        else {
            delta.y = 0;
            newPixelPos = obj.dragStartPixelPos.add(delta);
            var min = this.getMaxWithDir(new vec2(-1, 0));
            var max = this.getMaxWithDir(new vec2(1, 0));
            if (newPixelPos.x > max.x)
                newPixelPos.x = max.x;
            if (newPixelPos.x < min.x)
                newPixelPos.x = min.x;
        }
        obj.setVisualPixelPos(newPixelPos);
    };
    // Called by event (in constructor)
    Block.prototype.onEndDrag = function (obj, event) {
        event.preventDefault();
        var deltaTile = this.getPixelPos().divide(tileSize).round().sub(this.pos);
        if (obj.dragDirection)
            deltaTile.x = 0;
        else
            deltaTile.y = 0;
        obj.element.style.transition = "200ms";
        this.setPos(this.pos.add(deltaTile));
        // If actuallly changed position
        if (deltaTile.x != 0 || deltaTile.y != 0) {
            RecordUndo();
            moveCount++;
            DisplayMoves();
        }
    };
    // While dragging, returns the maximum pixel position of the tile in the given direction
    // FIXME: not working with multiple tiles (?)
    Block.prototype.getMaxWithDir = function (dir) {
        var delta = new vec2(0);
        while (true) {
            delta = delta.add(dir);
            var passed = true;
            for (var _i = 0, _a = this.getAllTiles(); _i < _a.length; _i++) {
                var myTile = _a[_i];
                var deltaTile = myTile.add(delta);
                if (deltaTile.x < 0 || deltaTile.y < 0 || deltaTile.x >= areaSize.x || deltaTile.y >= areaSize.y) {
                    passed = false;
                    break;
                }
                for (var _b = 0, tiles_1 = tiles; _b < tiles_1.length; _b++) {
                    var otherBlock = tiles_1[_b];
                    if (otherBlock.pos.isEq(this.pos))
                        continue;
                    for (var _c = 0, _d = otherBlock.getAllTiles(); _c < _d.length; _c++) {
                        var otherBlockTile = _d[_c];
                        if (otherBlockTile.isEq(deltaTile)) {
                            passed = false;
                            break;
                        }
                    }
                    if (!passed)
                        break;
                }
                if (!passed)
                    break;
            }
            if (!passed)
                break;
        }
        delta = delta.sub(dir);
        return this.getPos().add(delta).mult(tileSize);
    };
    // Get all the tiles that this block covers
    Block.prototype.getAllTiles = function () {
        var res = [];
        for (var x = 0; x < this.size.x; x++) {
            for (var y = 0; y < this.size.y; y++) {
                res.push(this.pos.add(new vec2(x, y)));
            }
        }
        return res;
    };
    return Block;
}());
// (Re)Starts the game!
function StartGame() {
    tiles = [
        new Block(new vec2(0, 3), new vec2(1, 2)),
        new Block(new vec2(3, 3), new vec2(1, 2)),
        new Block(new vec2(1, 4), new vec2(1)),
        new Block(new vec2(1, 3), new vec2(1)),
        new Block(new vec2(2, 4), new vec2(1)),
        new Block(new vec2(2, 3), new vec2(1)),
        new Block(new vec2(1, 2), new vec2(2, 1)),
        new Block(new vec2(0, 0), new vec2(1, 2)),
        new Block(new vec2(3, 0), new vec2(1, 2)),
        new Block(new vec2(1, 0), new vec2(2), true),
    ];
    moveCount = 0;
    DisplayMoves();
    undoIndex = -1;
    undo = [];
    RecordUndo();
    UpdateUndoBtns();
}
function DisplayMoves() {
    moveCountText.innerHTML = moveCount;
    moveCountLabel.innerHTML = moveCount === 1 ? "move" : "moves";
}
// Get elements
var area = document.getElementById("area");
var moveCountText = document.getElementById("move-count");
var moveCountLabel = document.getElementById("move-count-label");
// Create bg tiles
for (var i = 0; i < 20; i++) {
    var newEl = document.createElement("div");
    newEl.classList.add("bg-tile");
    area.appendChild(newEl);
}
// Get tile size
var tileSize = document.querySelector(".bg-tile").clientWidth + 10;
// Create tiles
var tiles;
var draggedBlock = null;
document.body.addEventListener("dragover", function (event) {
    draggedBlock.onDrag(draggedBlock, event);
});
var moveCount;
// Consts
var areaSize = new vec2(4, 5);
var undoDelay = 50;
StartGame();
