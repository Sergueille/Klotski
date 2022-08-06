// A tile that can be moved by the player
var Block = /** @class */ (function () {
    function Block(pos, size, isExit) {
        if (isExit === void 0) { isExit = false; }
        this.displayed = false; // Has the tile en HTMLElement
        this.pos = pos;
        this.size = size;
        this.isExit = isExit;
    }
    Block.prototype.setDisplay = function (newValue, parent) {
        var _this = this;
        if (parent === void 0) { parent = null; }
        if (newValue === this.displayed)
            return;
        this.displayed = newValue;
        if (this.displayed) {
            // Create element
            this.element = document.createElement("div");
            this.element.classList.add("block");
            this.element.draggable = true;
            parent.appendChild(this.element);
            // Set scale
            this.element.style.width = (this.size.x * tileSize) + "px";
            this.element.style.height = (this.size.y * tileSize) + "px";
            // Set color
            this.element.style.backgroundColor = this.getTileColor();
            // Assign events
            this.element.addEventListener("dragstart", function (ev) { return _this.onStartDrag(_this, ev); });
            this.element.addEventListener("dragend", function (ev) { return _this.onEndDrag(_this, ev); });
            // Set positon
            this.setPos(this.pos);
        }
        else {
            this.element.remove();
            this.element = null;
        }
    };
    // Create a small HTMLElement of the tile, to show in side panels
    Block.prototype.smallDisplay = function (parent, tileSize) {
        // Create element
        var smallEL = document.createElement("div");
        smallEL.classList.add("small-block");
        parent.appendChild(smallEL);
        // Set scale
        smallEL.style.width = (this.size.x * tileSize) + "px";
        smallEL.style.height = (this.size.y * tileSize) + "px";
        // Set pos
        smallEL.style.left = (this.pos.x * tileSize) + 5 + "px";
        smallEL.style.top = (this.pos.y * tileSize) + 5 + "px";
        smallEL.style.backgroundColor = this.getTileColor();
    };
    Block.prototype.getTileColor = function () {
        // Set color
        if (this.isExit) {
            return currentData.finished ? greenColor : redColor;
        }
        else {
            var randColorVal = Math.round(Math.random() * (randomColorMax - randomColorMin) + randomColorMin);
            return "#" + randColorVal.toString() + randColorVal.toString() + randColorVal.toString();
        }
    };
    Block.prototype.isDisplayed = function () { return this.displayed; };
    // Set tile position and update visual positon
    Block.prototype.setPos = function (newPos) {
        this.pos = newPos.copy();
        this.setVisualPos(newPos);
    };
    // Set visual position, in tiles
    Block.prototype.setVisualPos = function (newPos) {
        if (!this.displayed)
            return;
        this.element.style.left = (newPos.x * tileSize) + 5 + "px";
        this.element.style.top = (newPos.y * tileSize) + 5 + "px";
    };
    // Set visual position, in pixels
    Block.prototype.setVisualPixelPos = function (newPos) {
        if (!this.displayed)
            return;
        this.element.style.left = (newPos.x) + 5 + "px";
        this.element.style.top = (newPos.y) + 5 + "px";
    };
    // Get tile position
    Block.prototype.getPos = function () {
        return this.pos.copy();
    };
    // Get element positions, in pixels
    Block.prototype.getPixelPos = function () {
        if (!this.displayed)
            return new vec2(0);
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
            currentData.moveCount++;
            DisplayMoves();
            if (this.isExit && this.pos.isEq(new vec2(1, 3)) && !currentData.finished) {
                currentData.finished = true;
                this.element.style.backgroundColor = greenColor;
            }
            if (currentData.moveCount >= autoHideTutorialMoveCount) {
                HideTutorial();
            }
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
                for (var _b = 0, _c = currentData.tiles; _b < _c.length; _b++) {
                    var otherBlock = _c[_b];
                    if (otherBlock.pos.isEq(this.pos))
                        continue;
                    for (var _d = 0, _e = otherBlock.getAllTiles(); _d < _e.length; _d++) {
                        var otherBlockTile = _e[_d];
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
var GameData = /** @class */ (function () {
    function GameData() {
        this.undoIndex = -1;
        this.undo = [];
        this.moveCount = 0;
        this.tiles = [];
        this.finished = false;
    }
    return GameData;
}());
// (Re)Starts the game!
function StartGame(index) {
    // Destor previous tiles
    if (currentData !== undefined) {
        for (var _i = 0, _a = currentData.tiles; _i < _a.length; _i++) {
            var tile = _a[_i];
            tile.setDisplay(false);
        }
    }
    if (data[index]["gameData"] === null) {
        // Init new game
        data[index]["gameData"] = new GameData();
        currentData = data[index]["gameData"];
        currentData.undo = [];
        for (var _b = 0, _c = data[index]["tiles"]; _b < _c.length; _b++) {
            var tile = _c[_b];
            tile.setDisplay(true, area);
            currentData.tiles.push(tile);
        }
        RecordUndo();
    }
    else {
        currentData = data[index]["gameData"];
        for (var _d = 0, _e = currentData.tiles; _d < _e.length; _d++) {
            var tile = _e[_d];
            tile.setDisplay(true, area);
        }
    }
    UpdateUndoBtns();
    DisplayMoves();
}
// Update move counter
function DisplayMoves() {
    moveCountText.innerHTML = currentData.moveCount.toString();
    moveCountLabel.innerHTML = currentData.moveCount === 1 ? "move" : "moves";
}
function HideTutorial() {
    document.querySelector(".tutorial").classList.add("hidden");
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
var draggedBlock = null;
document.body.addEventListener("dragover", function (event) {
    draggedBlock.onDrag(draggedBlock, event);
});
// Consts
var areaSize = new vec2(4, 5);
var undoDelay = 50;
var redColor = "#502020";
var greenColor = "#205020";
var randomColorMin = 30;
var randomColorMax = 45;
var autoHideTutorialMoveCount = 5;
var currentData;
