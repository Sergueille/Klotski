// Get elements
const variantPanel: HTMLElement = document.getElementById("variants");
const variantList: HTMLElement = document.getElementById("variant-list");
const variantTemplate: HTMLElement = document.getElementById("variant-list-template");

let panelCreated: boolean = false;

function ToggleVariantPanel() {
    variantPanel.classList.toggle("hidden")

    if (!panelCreated) {
        panelCreated = true;

        // Populate panel list
        for (let i = 0; i < data.length; i++) {
            const obj = data[i];

            let newEl = variantTemplate.cloneNode(true) as HTMLElement;
            const newID = "variant" + i.toString();
            newEl.id = newID;
            newEl.addEventListener("click", () => StartGame(i))
            variantList.appendChild(newEl);

            document.querySelector("#" + newID + " > .variant-title").innerHTML = obj.name;
        }

        variantTemplate.remove();
    }
}
