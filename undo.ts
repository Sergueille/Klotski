// Init undo list
let undoIndex: number = -1;
let undo: Array<Array<vec2>> = []

// Get elements
const undoBtn = document.getElementById("undo")!!;
const redoBtn = document.getElementById("redo")!!;
const undoTenBtn = document.getElementById("undo-ten")!!;
const restartBtn = document.getElementById("restart")!!;

// Add an entry in the undo list
function RecordUndo() {
    let posList: Array<vec2> = [];
    for (const tile of tiles) {
        posList.push(tile.getPos());
    }

    if (undoIndex < undo.length - 1)
        undo = undo.slice(0, undoIndex + 1)

    undo.push(posList)
    undoIndex++;
    
    UpdateUndoBtns();
}

// Undo the game
function Undo() {
    if (undoIndex < 1) return;

    undoIndex--;
    ApplyUndoList(undoIndex);
}

// Undo the game many times
async function UndoMany(count: number) {
    for (let i = 0; i < count; i++) {
        if (undoIndex < 1) return;
        Undo();
        await delay(undoDelay);
    }
}

// Redo the game
function Redo() {
    if (undoIndex >= undo.length - 1) return;

    undoIndex++;
    ApplyUndoList(undoIndex);
}

// Apply an undo entry to the game
function ApplyUndoList(index: number) {
    let l = undo[index];

    for (let i = 0; i < l.length; i++) {
        tiles[i].setPos(l[i]);
    }
    
    UpdateUndoBtns();
}

// Update undo btns appearance
function UpdateUndoBtns() {
    if (undoIndex < 1) {
        undoBtn.setAttribute("disabled", "true");
        restartBtn.setAttribute("disabled", "true");
        undoTenBtn.setAttribute("disabled", "true");
    }
    else {
        undoBtn.removeAttribute("disabled");
        restartBtn.removeAttribute("disabled");
        undoTenBtn.removeAttribute("disabled");
    }

    if (undoIndex >= undo.length - 1)
        redoBtn.setAttribute("disabled", "true")
    else
        redoBtn.removeAttribute("disabled")
}
