// Get elements
const variantPanel: HTMLElement = document.getElementById("variants");
const variantList: HTMLElement = document.getElementById("variant-list");
const variantTemplate: HTMLElement = document.getElementById("variant-list-template");

function ToggleVariantPanel() {
    variantPanel.classList.toggle("hidden")
}

function HideVariantPanel() {
    if (!variantPanel.classList.contains("hidden"))
        variantPanel.classList.add("hidden")
}

// Populate panel list
for (let i = 0; i < data.length; i++) {
    const obj = data[i];

    let newEl = variantTemplate.cloneNode(true) as HTMLElement;
    const newID = "variant" + i.toString();
    newEl.id = newID;
    newEl.addEventListener("click", () => {
        HideVariantPanel();
        StartGame(i);
    });
    variantList.appendChild(newEl);

    document.querySelector("#" + newID + " > .tile-list-txt > .variant-title").innerHTML = obj.name;
    document.querySelector("#" + newID + " > .tile-list-txt > .variant-difficulty").innerHTML = obj.difficulty;

    let icon = document.querySelector("#" + newID + " > .tile-icon") as HTMLElement;
    let smallTileSize = (icon.clientHeight - 10) / 5;
    for (const tile of obj.tiles) {
        tile.smallDisplay(icon, smallTileSize);
    }
}
variantTemplate.remove();
