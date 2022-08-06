// A tile that can be moved by the player
class Block {
    private pos: vec2; // The positon of the tile, in tiles
    public size: vec2; // The size of the tile, in tiles
    public element: HTMLElement; // The HTMLElement of the tile
    public isExit: boolean; // Is this tile the big red tile?
    private displayed: boolean = false; // Has the tile en HTMLElement

    private dragStartMousePos: vec2; // Position of the mouse when the drag started
    private dragStartPixelPos: vec2; // Position, in pixels, of the block element when the drag started
    private dragDirection: boolean | null; // true is vertical

    constructor(pos: vec2, size: vec2, isExit: boolean = false) {
        this.pos = pos;
        this.size = size;
        this.isExit = isExit;
    }

    setDisplay(newValue: boolean) {
        if (newValue === this.displayed) return;
        this.displayed = newValue

        if (this.displayed) {
            // Create element
            this.element = document.createElement("div");
            this.element.classList.add("block");
            this.element.draggable = true;
            area.appendChild(this.element);

            // Set scale
            this.element.style.width = (this.size.x * tileSize) + "px";
            this.element.style.height = (this.size.y * tileSize) + "px";
            
            // Set color
            if (this.isExit) {
                this.element.style.backgroundColor = "#502020"
            }
            else {
                let randColorVal: number = Math.round(Math.random() * (45 - 30) + 30); 
                this.element.style.backgroundColor = "#" + randColorVal.toString() + randColorVal.toString() + randColorVal.toString();
            }
            
            // Assign events
            this.element.addEventListener("dragstart", ev => this.onStartDrag(this, ev));
            this.element.addEventListener("dragend", ev => this.onEndDrag(this, ev));

            // Set positon
            this.setPos(this.pos);
        } 
        else {
            this.element.remove();
            this.element = null;
        }
    }

    isDisplayed() { return this.displayed }

    // Set tile position and update visual positon
    setPos(newPos: vec2) {
        this.pos = newPos.copy();
        this.setVisualPos(newPos);
    }

    // Set visual position, in tiles
    setVisualPos(newPos: vec2) {
        if (!this.displayed) return;
        this.element.style.left = (newPos.x * tileSize) + 5 + "px";
        this.element.style.top = (newPos.y * tileSize) + 5 + "px";
    }

    // Set visual position, in pixels
    setVisualPixelPos(newPos: vec2) {
        if (!this.displayed) return;
        this.element.style.left = (newPos.x) + 5 + "px";
        this.element.style.top = (newPos.y) + 5 + "px";
    }

    // Get tile position
    getPos() {
        return this.pos.copy();
    }

    // Get element positions, in pixels
    getPixelPos() {
        if (!this.displayed) return new vec2(0);
        return new vec2(this.element.offsetLeft - 5, this.element.offsetTop - 5);
    }

    // Called by event (in constructor)
    onStartDrag(obj: Block, event: DragEvent) {
        draggedBlock = obj;
        obj.dragStartMousePos = new vec2(event.screenX, event.screenY);
        obj.dragStartPixelPos = obj.getPixelPos();
        obj.dragDirection = null;
        obj.element.style.transition = "none";
        event.dataTransfer?.setDragImage(new Image(), 0, 0);
    }

    // Called by event (in constructor)
    onDrag(obj: Block, event: DragEvent) {
        const mousePos: vec2 = new vec2(event.screenX, event.screenY);
        let delta: vec2 = mousePos.sub(obj.dragStartMousePos);

        if (obj.dragDirection === null)
            obj.dragDirection = Math.abs(delta.y) > Math.abs(delta.x);

        let newPixelPos;
        if (obj.dragDirection) {
            delta.x = 0;

            newPixelPos = obj.dragStartPixelPos.add(delta);
            const min: vec2 = this.getMaxWithDir(new vec2(0, -1));
            const max: vec2 = this.getMaxWithDir(new vec2(0, 1));

            if (newPixelPos.y > max.y) newPixelPos.y = max.y;
            if (newPixelPos.y < min.y) newPixelPos.y = min.y;
        }
        else {
            delta.y = 0;

            newPixelPos = obj.dragStartPixelPos.add(delta);
            const min: vec2 = this.getMaxWithDir(new vec2(-1, 0));
            const max: vec2 = this.getMaxWithDir(new vec2(1, 0));

            if (newPixelPos.x > max.x) newPixelPos.x = max.x;
            if (newPixelPos.x < min.x) newPixelPos.x = min.x;
        }

        obj.setVisualPixelPos(newPixelPos);
    }

    // Called by event (in constructor)
    onEndDrag(obj: Block, event: DragEvent) {
        event.preventDefault();

        let deltaTile: vec2 = this.getPixelPos().divide(tileSize).round().sub(this.pos);

        if (obj.dragDirection)
            deltaTile.x = 0
        else
            deltaTile.y = 0

        obj.element.style.transition = "200ms";
        this.setPos(this.pos.add(deltaTile));

        // If actuallly changed position
        if (deltaTile.x != 0 || deltaTile.y != 0)
        {
            RecordUndo();
            currentData.moveCount++;
            DisplayMoves();
        }
    }

    // While dragging, returns the maximum pixel position of the tile in the given direction
    // FIXME: not working with multiple tiles (?)
    getMaxWithDir(dir: vec2) {
        let delta: vec2 = new vec2(0);

        while (true) {
            delta = delta.add(dir);
            let passed = true;
            for (const myTile of this.getAllTiles()) {
                let deltaTile = myTile.add(delta);
                if (deltaTile.x < 0 || deltaTile.y < 0 || deltaTile.x >= areaSize.x || deltaTile.y >= areaSize.y){
                    passed = false;
                    break;
                }

                for (const otherBlock of currentData.tiles) {
                    if (otherBlock.pos.isEq(this.pos))
                        continue;

                    for (const otherBlockTile of otherBlock.getAllTiles()) {
                        if (otherBlockTile.isEq(deltaTile)) {
                            passed = false;
                            break;
                        }
                    }
                    if (!passed) break
                }
                if (!passed) break
            }
            if (!passed) break
        }

        delta = delta.sub(dir);
        return this.getPos().add(delta).mult(tileSize);
    }

    // Get all the tiles that this block covers
    getAllTiles(): Array<vec2> {
        let res: Array<vec2> = [];
        for (let x = 0; x < this.size.x; x++) {
            for (let y = 0; y < this.size.y; y++) {
                res.push(this.pos.add(new vec2(x, y)));
            }
        }

        return res;
    }
}

class GameData {
    public undoIndex: number = -1;
    public undo: Array<Array<vec2>> = [];
    public moveCount: number = 0;
    public tiles: Array<Block> = [];
}

// (Re)Starts the game!
function StartGame(index: number) {
    // Destor previous tiles
    if (currentData !== undefined) {
        for (const tile of currentData.tiles) {
            tile.setDisplay(false);
        }
    }

    if (data[index]["gameData"] === null) {

        // Init new game
        data[index]["gameData"] = new GameData();
        currentData = data[index]["gameData"];
        currentData.undo = [];

        for (const tile of data[index]["tiles"]) {
            tile.setDisplay(true);
            currentData.tiles.push(tile);
        }
        
        RecordUndo();
    }
    else {
        currentData = data[index]["gameData"];
        for (const tile of currentData.tiles) {
            tile.setDisplay(true);
        }
    }

    UpdateUndoBtns();
    DisplayMoves();
}

// Update move counter
function DisplayMoves() {
    moveCountText.innerHTML = currentData.moveCount.toString();
    moveCountLabel.innerHTML = currentData.moveCount === 1? "move" : "moves"; 
}

// Get elements
const area = document.getElementById("area")!!;
const moveCountText = document.getElementById("move-count")!!;
const moveCountLabel = document.getElementById("move-count-label")!!;

// Create bg tiles
for (let i = 0; i < 20; i++) {
    let newEl: HTMLElement = document.createElement("div");
    newEl.classList.add("bg-tile");
    area.appendChild(newEl);
}

// Get tile size
const tileSize = document.querySelector(".bg-tile")!!.clientWidth + 10;

let draggedBlock: Block = null;
document.body.addEventListener("dragover", event => {
    draggedBlock.onDrag(draggedBlock, event);
});

// Consts
const areaSize = new vec2(4, 5);
const undoDelay = 50;

let currentData: GameData;
