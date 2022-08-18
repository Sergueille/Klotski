var deletePanel = document.getElementById("delete-panel");
function SaveGame() {
    var _a, _b;
    var saveData = {
        games: {},
        currentPuzzle: currentData.puzzleName
    };
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var game = data_1[_i];
        saveData.games[game.name] = {
            finished: (_a = game.gameData) === null || _a === void 0 ? void 0 : _a.finished,
            bestMoves: (_b = game.gameData) === null || _b === void 0 ? void 0 : _b.bestMoves
        };
    }
    var dataString = JSON.stringify(saveData);
    document.cookie = "gameData=".concat(dataString, "; max-age=").concat(86400 * cookieValidity, "; SameSite=lax");
}
function LoadGame() {
    console.log(document.cookie);
    if (document.cookie != "") {
        try {
            var regex = new RegExp("([^=]*)\s*=\s*([^;]*)(?:;\s*)?");
            var match = regex.exec(document.cookie);
            var obj = {};
            for (var i = 0; i < match.length; i += 3) {
                obj[match[i + 1]] = match[i + 2];
            }
            if (obj.hasOwnProperty("gameData") && obj["gameData"].trim() != "") {
                var saveData = JSON.parse(obj["gameData"]);
                var startIndex = 0;
                for (var i = 0; i < data.length; i++) {
                    var thisGameData = saveData.games[data[i].name];
                    if (thisGameData) {
                        data[i].gameData.finished = thisGameData.finished;
                        data[i].gameData.bestMoves = thisGameData.bestMoves;
                    }
                    if (saveData.currentPuzzle === data[i].name) {
                        startIndex = i;
                    }
                }
                StartGame(startIndex);
                return;
            }
        }
        catch (error) {
            alert("Oops! The webside couldn't load your progress from the cookies files. Please report this error message to the developper:\n\n"
                + error + "\n" + document.cookie);
        }
    }
    ShowTutorial();
    StartGame(0);
}
function DeleteCookies() {
    ToggleDeletePanel();
}
function DeleteCookiesWithoutPanel() {
    document.cookie = "gameData=;";
    window.location.reload();
}
function ToggleDeletePanel() {
    deletePanel.classList.toggle("hidden");
}
