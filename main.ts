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

    setDisplay(newValue: boolean, parent: HTMLElement = null) {
        if (newValue === this.displayed) return;
        this.displayed = newValue

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
            this.element.addEventListener("dragstart", ev => this.onStartDrag(this, ev));
            this.element.addEventListener("touchstart", ev => this.onStartDrag(this, null, ev));
            this.element.addEventListener("dragend", ev => this.onEndDrag(this, ev));
            this.element.addEventListener("touchend", ev => this.onEndDrag(this, ev));

            // Set positon
            this.setPos(this.pos);
        } 
        else {
            this.element.remove();
            this.element = null;
        }
    }

    forceUpdateDisplay() {
        let oldParent = this.element.parentElement;
        this.setDisplay(false);
        this.setDisplay(true, oldParent);
    }

    // Create a small HTMLElement of the tile, to show in side panels
    smallDisplay(parent: HTMLElement, tileSize: number) {
        // Create element
        let smallEL = document.createElement("div");
        smallEL.classList.add("small-block");
        parent.appendChild(smallEL);

        // Set scale
        smallEL.style.width = (this.size.x * tileSize) + "px";
        smallEL.style.height = (this.size.y * tileSize) + "px";
        // Set pos
        smallEL.style.left = (this.pos.x * tileSize) + 5 + "px";
        smallEL.style.top = (this.pos.y * tileSize) + 5 + "px";

        smallEL.style.backgroundColor = this.getTileColor(true);
    }

    getTileColor(forceRed: boolean = false) {
        // Set color
        if (this.isExit) {
            return !forceRed && currentData.finished? greenColor : redColor
        }
        else {
            let randColorVal: number = Math.round(Math.random() * (randomColorMax - randomColorMin) + randomColorMin); 
            return "#" + randColorVal.toString() + randColorVal.toString() + randColorVal.toString();
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
    onStartDrag(obj: Block, event: DragEvent, touchEvent: TouchEvent = null) {
        draggedBlock = obj;
        obj.dragStartMousePos = event
            ? new vec2(event.screenX, event.screenY)
            : new vec2(touchEvent.touches[0].screenX, touchEvent.touches[0].screenY);

        obj.dragStartPixelPos = obj.getPixelPos();
        obj.dragDirection = null;
        obj.element.style.transition = "none";

        event?.dataTransfer?.setDragImage(new Image(), 0, 0);
    }

    // Called by event (in constructor)
    onDrag(obj: Block, event: DragEvent, touchEvent: TouchEvent = null) {
        const mousePos: vec2 = event
            ? new vec2(event.screenX, event.screenY)
            : new vec2(touchEvent.touches[0].screenX, touchEvent.touches[0].screenY);

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
    onEndDrag(obj: Block, event: Event) {
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

            if (this.isExit && this.pos.isEq(new vec2(1, 3))){
                currentData.finished = true;
                this.element.style.backgroundColor = greenColor;

                if (currentData.moveCount < currentData.bestMoves) 
                    currentData.bestMoves = currentData.moveCount;
            }

            DisplayMoves();
            SaveGame();

            if (currentData.moveCount >= autoHideTutorialMoveCount) {
                HideTutorial();
            }
        }

        draggedBlock = null;
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
    public finished: boolean = false;
    public bestMoves: number = 999999999;
    public puzzleName: string = "";
}

function Setup() {
    for (const game of data) {
        // Init new game
        game["gameData"] = new GameData();
        game["gameData"].undo = [];

        for (const tile of game["tiles"]) {
            game["gameData"].tiles.push(tile);
        }

        game["gameData"].puzzleName = game.name;
    }
}

// (Re)Starts the game!
function StartGame(index: number) {
    // Destor previous tiles
    if (currentData !== undefined) {
        for (const tile of currentData.tiles) {
            tile.setDisplay(false);
        }
    }

    currentData = data[index]["gameData"];
    for (const tile of currentData.tiles) {
        tile.setDisplay(true, area);
    }

    if (currentData.undo.length === 0)
        RecordUndo();

    UpdateUndoBtns();
    DisplayMoves();
}

// Update move counter
function DisplayMoves() {
    moveCountText.innerHTML = currentData.moveCount.toString();
    moveCountLabel.innerHTML = currentData.moveCount === 1? "move" : "moves"; 

    if (currentData.finished) {
        bestMoveCountText.classList.remove("disabled");
        bestMoveCountLabel.classList.remove("disabled");

        bestMoveCountText.innerHTML = currentData.bestMoves.toString();
    } 
    else {
        bestMoveCountText.classList.add("disabled");
        bestMoveCountLabel.classList.add("disabled");
    }
}

function ShowTutorial() {
    document.querySelector(".tutorial").classList.remove("hidden");
}

function HideTutorial() {
    document.querySelector(".tutorial").classList.add("hidden");
}

// Get elements
const area = document.getElementById("area")!!;
const moveCountText = document.getElementById("move-count")!!;
const moveCountLabel = document.getElementById("move-count-label")!!;
const bestMoveCountText = document.getElementById("move-count-best")!!;
const bestMoveCountLabel = document.getElementById("move-count-label-best")!!;

// Create bg tiles
for (let i = 0; i < 20; i++) {
    let newEl: HTMLElement = document.createElement("div");
    newEl.classList.add("bg-tile");
    area.appendChild(newEl);
}

// Get tile size
let tileSize = document.querySelector(".bg-tile")!!.clientWidth + 10;

let draggedBlock: Block = null;
document.body.addEventListener("dragover", event => {
    draggedBlock?.onDrag(draggedBlock, event);
});
document.body.addEventListener("touchmove", event => {
    draggedBlock?.onDrag(draggedBlock, null, event);
});

addEventListener("resize", () => {
    let newTileSize = document.querySelector(".bg-tile")!!.clientWidth + 10;

    if (newTileSize != tileSize)
    {
        tileSize = newTileSize;
        
        for (let tile of currentData.tiles) {
            tile.forceUpdateDisplay();
        }
    }
});

// Consts
const areaSize = new vec2(4, 5);
const undoDelay = 50;
const redColor = "#502020";
const greenColor = "#205020";
const randomColorMin = 30;
const randomColorMax = 45;
const autoHideTutorialMoveCount = 5;
const cookieValidity = 365; // In days

let currentData: GameData;
