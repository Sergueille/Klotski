function SaveGame() {
    let saveData: Array<Object> = [];
    for (const game of data) {
        saveData.push({
            finished: game.gameData?.finished,
            bestMoves: game.gameData?.bestMoves,
        });
    }

    const dataString = JSON.stringify(saveData);

    document.cookie = `gameData=${dataString}; max-age=${86400 * cookieValidity}; SameSite=lax`;
}

function LoadGame() {
    if (document.cookie != "") {
        console.log(document.cookie)
        let regex = new RegExp("([^=]*)\s*=\s*([^;]*)(?:;\s*)?");
        let match = regex.exec(document.cookie)

        let obj: Object = {};
        for (let i = 0; i < match.length; i += 3) {
            obj[match[i + 1]] = match[i + 2];
        }

        let gameData = JSON.parse(obj["gameData"]);
        for (let i = 0; i < data.length; i++) {
            data[i].gameData.finished = gameData[i].finished
            data[i].gameData.bestMoves = gameData[i].bestMoves
        }
    }
    else
        ShowTutorial();
}
