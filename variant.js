// Get elements
var variantPanel = document.getElementById("variants");
var variantList = document.getElementById("variant-list");
var variantTemplate = document.getElementById("variant-list-template");
function ToggleVariantPanel() {
    variantPanel.classList.toggle("hidden");
}
function HideVariantPanel() {
    if (!variantPanel.classList.contains("hidden"))
        variantPanel.classList.add("hidden");
}
var _loop_1 = function (i) {
    var obj = data[i];
    var newEl = variantTemplate.cloneNode(true);
    var newID = "variant" + i.toString();
    newEl.id = newID;
    newEl.addEventListener("click", function () {
        HideVariantPanel();
        StartGame(i);
    });
    variantList.appendChild(newEl);
    document.querySelector("#" + newID + " > .tile-list-txt > .variant-title").innerHTML = obj.name;
    document.querySelector("#" + newID + " > .tile-list-txt > .variant-difficulty").innerHTML = obj.difficulty;
    var icon = document.querySelector("#" + newID + " > .tile-icon");
    var smallTileSize = (icon.clientHeight - 10) / 5;
    for (var _i = 0, _a = obj.tiles; _i < _a.length; _i++) {
        var tile = _a[_i];
        tile.smallDisplay(icon, smallTileSize);
    }
};
// Populate panel list
for (var i = 0; i < data.length; i++) {
    _loop_1(i);
}
variantTemplate.remove();
