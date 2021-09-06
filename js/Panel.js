class Panel {
    // Select panel by clicking on panel:
    static selectByClick (e) {
        e.stopPropagation();
        Panel.selectPanel(e.target.closest("div.wrapper"));
    }

    // Select panel by SELECT
    static selectBySelector (e) {
        e.stopPropagation();
        Panel.selectPanel(document.querySelector("#frontpage div.wrapper[data-title='" + e.currentTarget.value + "']"));
    }

    // Create new panel:
    static addPanel (e) {
        e.preventDefault();
        panelActive = document.getElementById("frontpage").appendChild(
            document.getElementById("panel-source").cloneNode(true)
        );
        panelActive.style.display = "";
        var o = document.createElement("option");
        var name = "Panel " + document.querySelectorAll("#frontpage div.wrapper").length;
        o.value = name;
        o.text = name;
        document.getElementById("panel-select-panel").appendChild(o);
        panelActive.setAttribute("data-title", name);
        Panel.selectPanel(panelActive);
    }

    // Select panel:
    static selectPanel (panel) {
        panelActive = panel;
        Transfer.attr2form(panelActive, document.getElementById("attributes"));
        Transfer.attr2filter(panelActive, document.getElementById("filters-panel"));
        var pointerStyle = document.getElementById("pointer").style;
        pointerStyle.top = (panelActive.offsetTop * scaleManager.scale) + 2 + "px";
        pointerStyle.height = (panelActive.offsetHeight * scaleManager.scale) + 2 + "px";
        document.getElementById("panel-select-panel").value = panelActive.getAttribute("data-title");
    }

    // Update panel attribute:
    static update (e) {
        if (!panelActive) {
            return;
        }
        Transfer.input2attr(e.target, panelActive);
    }
}
