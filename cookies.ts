function SaveGame() {
    let saveData = {
        games: {},
        currentPuzzle: currentData.puzzleName,
    };

    for (const game of data) {
        saveData.games[game.name] = {
            finished: game.gameData?.finished,
            bestMoves: game.gameData?.bestMoves,
        };
    }

    const dataString = JSON.stringify(saveData);

    document.cookie = `gameData=${dataString}; max-age=${86400 * cookieValidity}; SameSite=lax`;
}

function LoadGame() {
    if (document.cookie != "") {
        let regex = new RegExp("([^=]*)\s*=\s*([^;]*)(?:;\s*)?");
        let match = regex.exec(document.cookie)

        let obj: Object = {};
        for (let i = 0; i < match.length; i += 3) {
            obj[match[i + 1]] = match[i + 2];
        }

        let saveData = JSON.parse(obj["gameData"]);
        let startIndex = 0;
        for (let i = 0; i < data.length; i++) {
            let thisGameData = saveData.games[data[i].name];
            if (thisGameData) {
                data[i].gameData.finished = thisGameData.finished
                data[i].gameData.bestMoves = thisGameData.bestMoves
            }

            if (saveData.currentPuzzle === data[i].name) {
                startIndex = i;
            }
        }

        
        StartGame(startIndex);
    }
    else {
        ShowTutorial();
        StartGame(0);
    }
}
