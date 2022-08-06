// Get elements
var variantPanel = document.getElementById("variants");
var variantList = document.getElementById("variant-list");
var variantTemplate = document.getElementById("variant-list-template");
var panelCreated = false;
function ToggleVariantPanel() {
    variantPanel.classList.toggle("hidden");
    if (!panelCreated) {
        panelCreated = true;
        var _loop_1 = function (i) {
            var obj = data[i];
            var newEl = variantTemplate.cloneNode(true);
            var newID = "variant" + i.toString();
            newEl.id = newID;
            newEl.addEventListener("click", function () { return StartGame(i); });
            variantList.appendChild(newEl);
            document.querySelector("#" + newID + " > .variant-title").innerHTML = obj.name;
        };
        // Populate panel list
        for (var i = 0; i < data.length; i++) {
            _loop_1(i);
        }
        variantTemplate.remove();
    }
}
