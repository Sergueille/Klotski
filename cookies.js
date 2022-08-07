function SaveGame() {
    var _a, _b;
    var saveData = [];
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var game = data_1[_i];
        saveData.push({
            finished: (_a = game.gameData) === null || _a === void 0 ? void 0 : _a.finished,
            bestMoves: (_b = game.gameData) === null || _b === void 0 ? void 0 : _b.bestMoves
        });
    }
    var dataString = JSON.stringify(saveData);
    document.cookie = "gameData=".concat(dataString, "; max-age=").concat(86400 * cookieValidity, "; SameSite=lax");
}
function LoadGame() {
    if (document.cookie != "") {
        console.log(document.cookie);
        var regex = new RegExp("([^=]*)\s*=\s*([^;]*)(?:;\s*)?");
        var match = regex.exec(document.cookie);
        var obj = {};
        for (var i = 0; i < match.length; i += 3) {
            obj[match[i + 1]] = match[i + 2];
        }
        var gameData = JSON.parse(obj["gameData"]);
        for (var i = 0; i < data.length; i++) {
            data[i].gameData.finished = gameData[i].finished;
            data[i].gameData.bestMoves = gameData[i].bestMoves;
        }
    }
    else
        ShowTutorial();
}
