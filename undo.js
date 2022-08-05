var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// Init undo list
var undoIndex = -1;
var undo = [];
// Get elements
var undoBtn = document.getElementById("undo");
var redoBtn = document.getElementById("redo");
var undoTenBtn = document.getElementById("undo-ten");
var restartBtn = document.getElementById("restart");
// Add an entry in the undo list
function RecordUndo() {
    var posList = [];
    for (var _i = 0, tiles_1 = tiles; _i < tiles_1.length; _i++) {
        var tile = tiles_1[_i];
        posList.push(tile.getPos());
    }
    if (undoIndex < undo.length - 1)
        undo = undo.slice(0, undoIndex + 1);
    undo.push(posList);
    undoIndex++;
    UpdateUndoBtns();
}
// Undo the game
function Undo() {
    if (undoIndex < 1)
        return;
    undoIndex--;
    moveCount--;
    ApplyUndoList(undoIndex);
}
// Undo the game many times
function UndoMany(count) {
    return __awaiter(this, void 0, void 0, function () {
        var i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < count)) return [3 /*break*/, 4];
                    if (undoIndex < 1)
                        return [2 /*return*/];
                    Undo();
                    return [4 /*yield*/, delay(undoDelay)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Redo the game
function Redo() {
    if (undoIndex >= undo.length - 1)
        return;
    undoIndex++;
    moveCount++;
    ApplyUndoList(undoIndex);
}
// Apply an undo entry to the game
function ApplyUndoList(index) {
    var l = undo[index];
    for (var i = 0; i < l.length; i++) {
        tiles[i].setPos(l[i]);
    }
    DisplayMoves();
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
        redoBtn.setAttribute("disabled", "true");
    else
        redoBtn.removeAttribute("disabled");
}
