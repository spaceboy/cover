class SizeElement {

    unitList = {
        "em": "em",
        "px": "px",
        "mm": "mm",
        "cm": "cm",
        "in": "in (96px)",
        "pt": "pt (1/72 in)",
        "pc": "pc (12 pt, 1/6 in)",
        "ex": "ex",
        "ch": "ch",
        "rem": "rem",
        "vw": "vw",
        "vh": "vh",
        "vmin": "vmin",
        "vmax": "vmax",
        "%": "%"
    };

    constructor (el) {
        var wrapper = document.createElement("div"),
            parent = el.parentNode,
            name = el.name;
        wrapper.setAttribute("class", "size-wrapper");
        el.after(wrapper);
        
        var elNew = wrapper.appendChild(el.cloneNode(true));
        elNew.style.display = "none";
        parent.removeChild(el);
        elNew.addEventListener("change", eventPanelUpdate);
        elNew.addEventListener(
            "update",
            function (e) {
                var val = e.currentTarget.value,
                    parent = e.currentTarget.closest("div");
                parent.querySelector("*[name$='.size']").value = val.replace(/[^\.0-9]/g, '');
                parent.querySelector("*[name$='.unit']").value = val.replace(/[\.0-9]/g, '');
            }
        );
    
        var inp = document.createElement("input");
        inp.name = name + ".size";
        inp.setAttribute("data-skip", "true");
        wrapper.appendChild(inp);
        inp.addEventListener(
            "change",
            function (e) {
                elNew.value = e.target.value + parent.querySelector("[name='" + name + ".unit']").value;
                elNew.dispatchEvent(new Event("change"));
            }
        );
        
        var unit = document.createElement("select");
        unit.name = elNew.name + ".unit";
        unit.setAttribute("data-skip", "true");
        for (var i in this.unitList) {
            var o = document.createElement("option");
            o.value = i;
            o.innerText = this.unitList[i];
            unit.appendChild(o);
        }
        wrapper.appendChild(unit);
        unit.addEventListener(
            "change",
            function (e) {
                elNew.value = parent.querySelector("[name='" + name + ".size']").value + e.target.value;
                elNew.dispatchEvent(new Event("change"));
            }
        );
    }
}
