// Get elements
const undoBtn = document.getElementById("undo")!!;
const redoBtn = document.getElementById("redo")!!;
const undoTenBtn = document.getElementById("undo-ten")!!;
const restartBtn = document.getElementById("restart")!!;

// Add an entry in the undo list
function RecordUndo() {
    let posList: Array<vec2> = [];
    for (const tile of currentData.tiles) {
        posList.push(tile.getPos());
    }

    if (currentData.undoIndex < currentData.undo.length - 1)
        currentData.undo = currentData.undo.slice(0, currentData.undoIndex + 1)

    currentData.undo.push(posList)
    currentData.undoIndex++;
    
    UpdateUndoBtns();
}

// Undo the game
function Undo() {
    if (currentData.undoIndex < 1) return;

    currentData.undoIndex--;
    currentData.moveCount--;
    ApplyUndoList(currentData.undoIndex);
}

// Undo the game many times
async function UndoMany(count: number) {
    for (let i = 0; i < count; i++) {
        if (currentData.undoIndex < 1) return;
        Undo();
        await delay(undoDelay);
    }
}

// Redo the game
function Redo() {
    if (currentData.undoIndex >= currentData.undo.length - 1) return;

    currentData.undoIndex++;
    currentData.moveCount++;
    ApplyUndoList(currentData.undoIndex);
}

// Apply an undo entry to the game
function ApplyUndoList(index: number) {
    let l = currentData.undo[index];

    for (let i = 0; i < l.length; i++) {
        currentData.tiles[i].setPos(l[i]);
    }
    
    DisplayMoves();
    UpdateUndoBtns();
}

// Update undo btns appearance
function UpdateUndoBtns() {
    if (currentData.undoIndex < 1) {
        undoBtn.setAttribute("disabled", "true");
        restartBtn.setAttribute("disabled", "true");
        undoTenBtn.setAttribute("disabled", "true");
    }
    else {
        undoBtn.removeAttribute("disabled");
        restartBtn.removeAttribute("disabled");
        undoTenBtn.removeAttribute("disabled");
    }

    if (currentData.undoIndex >= currentData.undo.length - 1)
        redoBtn.setAttribute("disabled", "true")
    else
        redoBtn.removeAttribute("disabled")
}
