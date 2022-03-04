class Panel {

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

    static swapNodes (n1, n2) {
        // Find parents:
        var p1 = n1.parentNode;
        var p2 = n2.parentNode;
        if (!p1 || !p2 || p1.isEqualNode(n2) || p2.isEqualNode(n1)) {
            return;
        }
        // Create placeholders:
        var ph1 = document.createElement("span");
        p1.insertBefore(ph1, n1);
        var ph2 = document.createElement("span");
        p2.insertBefore(ph2, n2);
        // Move nodes:
        p1.insertBefore(n2, ph1);
        p2.insertBefore(n1, ph2);
        // Remove placeholders:
        p1.removeChild(ph1);
        p2.removeChild(ph2);
    }

    static panelMoveUp (e) {
        e.preventDefault();
        let s = document.getElementById("panel-select-panel");
        let i = s.selectedIndex;
        if (i < 1) {
            return;
        }
        Panel.swapNodes(
            document.querySelector(`#frontpage div.wrapper[data-title="${s.options[i].value}"]`),
            document.querySelector(`#frontpage div.wrapper[data-title="${s.options[i - 1].value}"]`)
        );
        Panel.swapNodes(s.options[i], s.options[i - 1]);
    }

    static panelMoveDn (e) {
        e.preventDefault();
        let s = document.getElementById("panel-select-panel");
        let i = s.selectedIndex;
        if (i < 0 || i === (s.options.length - 1)) {
            return;
        }
        Panel.swapNodes(
            document.querySelector(`#frontpage div.wrapper[data-title="${s.options[i + 1].value}"]`),
            document.querySelector(`#frontpage div.wrapper[data-title="${s.options[i].value}"]`)
        );
        Panel.swapNodes(s.options[i + 1], s.options[i]);
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
        if (l < 2) {
            return;
        }
        var o = Panel.getActiveSelectOption();
        if (!o) {
            return;
        }
        if (!confirm("Remove active panel?")) {
            return;
        }
        var p = document.querySelector(`#frontpage div.wrapper[data-title="${o.value}"]`);
        s.removeChild(o);
        p.parentNode.removeChild(p);
        if (l > 3) {
            s.size = --l;
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
        // Create and place option in panel select:
        var o = document.createElement("option");
        var name = "Panel " + document.querySelectorAll("#frontpage div.wrapper").length;
        o.value = name;
        o.text = name;
        var select = document.getElementById("panel-select-panel");
        var opt = select.options[select.selectedIndex];
        if (opt.nextSibling) {
            select.insertBefore(o, opt.nextSibling);
        } else {
            select.appendChild(o);
        }
        panelActive.setAttribute("data-title", name);
        select.size = ++(select.size);
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
}
