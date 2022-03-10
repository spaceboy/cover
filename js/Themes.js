class Themes {

    themes = {
        "Pro dívky": "mladi-na-kridlech.json",
        "Budovatelský": "pribehy-z-jizniho-mesta.json",
        "Skenovaná obálka": "theme01.json",
        "Z fotografie": "theme02.json",
        "S překryvem": "theme03.json"
    };

    applyButton;

    templateDir = "themes/";

    buffer;

    constructor (wrapper, template, applyButton) {
        // Create buffer:
        var b = document.createElement("iframe");
        b.style.display = "none";
        b.src = "";
        wrapper.appendChild(b);
        b.addEventListener("load", e => this.onLoadBuffer(e));
        this.buffer = b;

        // Create menu:
        for (var t in this.themes) {
            var s = template.cloneNode(true);
            s.querySelector("h3").innerHTML = t;
            s.setAttribute("data-file", this.themes[t]);
            wrapper.appendChild(s).addEventListener("click", e => this.onClickButton(e));
        }

        // Set apply button:
        this.applyButton = applyButton;
    }

    onClickButton (e) {
        this.buffer.src = this.templateDir + e.currentTarget.getAttribute("data-file");
    }

    onLoadBuffer (e) {
        var t = this.buffer.contentDocument.body.innerText.trim();
        if (!t) {
            return;
        }
        document.getElementById("jsonText").innerHTML = t;
        if (this.applyButton) {
            this.applyButton.dispatchEvent(new Event("click"))
        };
    }
}
