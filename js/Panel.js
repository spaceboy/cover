// requires Elem class

class Panel {

    static listSizeMin = 3

    static listItemsMin = 1

    static getActiveSelectOption () {
        let s = document.getElementById("panel-select-panel");
        let i = s.selectedIndex;
        if (-1 === i) {
            return null;
        }
        return s.options[i];
    }

    static getActiveTitle () {
        var o = Panel.getActiveSelectOption();
        return (
            o
            ? o.value
            : null
        );
    }

    static panelMoveUp (e) {
        e.preventDefault();
        let s = document.getElementById("panel-select-panel");
        let i = s.selectedIndex;
        if (i < 1) {
            return;
        }
        Elem.swapNodes(
            document.querySelector(`#frontpage div.wrapper[data-title="${s.options[i].value}"]`),
            document.querySelector(`#frontpage div.wrapper[data-title="${s.options[i - 1].value}"]`)
        );
        Elem.swapNodes(s.options[i], s.options[i - 1]);
    }

    static panelMoveDn (e) {
        e.preventDefault();
        let s = document.getElementById("panel-select-panel");
        let i = s.selectedIndex;
        if (i < 0 || i === (s.options.length - 1)) {
            return;
        }
        Elem.swapNodes(
            document.querySelector(`#frontpage div.wrapper[data-title="${s.options[i + 1].value}"]`),
            document.querySelector(`#frontpage div.wrapper[data-title="${s.options[i].value}"]`)
        );
        Elem.swapNodes(s.options[i + 1], s.options[i]);
    }

    static panelAdd (e) {
        e.preventDefault();
        var title = Panel.getActiveTitle();
        if (!title) {
            return;
        }
        Panel.addPanelAfter(document.querySelector(`#frontpage div.wrapper[data-title="${title}"]`));
    }

    static panelRemove (e) {
        e.preventDefault();
        var s = document.getElementById("panel-select-panel");
        var l = s.options.length;
        if (l <= Panel.listItemsMin) {
            return;
        }
        var o = Panel.getActiveSelectOption();
        if (!o) {
            return;
        }
        if (!confirm("Remove active panel?")) {
            return;
        }

        // Remove panel:
        var p = document.querySelector(`#frontpage div.wrapper[data-title="${o.value}"]`);

        // Find next|prev panel:
        var panelActive = p.nextElementSibling;
        panelActive = (panelActive ? panelActive : p.previousElementSibling);

        s.removeChild(o);
        p.parentNode.removeChild(p);
        if (l > Panel.listSizeMin) {
            s.size = --l;
        }

        // Select another panel:
        if (panelActive) {
            Panel.selectPanel(panelActive);
        }
    }

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
    static addPanelAfter (el) {
        // Create and place new panel:
        var name = "Panel " + Panel.getNewPanelNumber();
        panelActive = (
            el.nextSibling
            ? document.getElementById("frontpage").insertBefore(
                document.getElementById("panel-source").cloneNode(true),
                el.nextSibling
            )
            : document.getElementById("frontpage").appendChild(
                document.getElementById("panel-source").cloneNode(true),
            )
        );
        panelActive.style.display = "";
        panelActive.removeAttribute("id");
        panelActive.setAttribute("data-title", name);

        // Create and place option in panel select:
        var o = document.createElement("option");
        o.value = name;
        o.text = name;
        var select = document.getElementById("panel-select-panel");
        var opt = select.options[select.selectedIndex];
        if (opt.nextSibling) {
            select.insertBefore(o, opt.nextSibling);
        } else {
            select.appendChild(o);
        }

        // Recompute select size:
        if (select.querySelectorAll("option").length > Panel.listSizeMin) {
            select.size = ++(select.size);
        }

        // Switch to new panel:
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

    static getNewPanelNumber () {
        var max = 0, n;
        for (el of document.querySelectorAll("#frontpage div.wrapper")) {
            n = parseInt(el.getAttribute("data-title").replace(/[^0-9]/g, ""));
            if (n > max) {
                max = n;
            }
        }
        return ++max;
    }
}
