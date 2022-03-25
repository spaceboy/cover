class Overlay {

    static init () {
        document.getElementById("overlay-button-add").addEventListener("click", Overlay.addOverlay)
        document.getElementById("overlay-button-remove").addEventListener("click", Overlay.removeOverlay);
        document.getElementById("overlay-select-overlay").addEventListener("change", Overlay.changeOverlay);
    }

    static getActiveOverlay () {
        return document.querySelector("#frontpage > div.overlay[data-title='" + document.getElementById("overlay-select-overlay").value + "']");
    }

    static changeForm (e) {
        Transfer.input2attr(e.target, Overlay.getActiveOverlay());
    }

    static createOverlay () {
        var s = new Elem(document.getElementById("overlay-select-overlay"));
        var l = s.childCount("option") + 1;
        var num = Overlay.getMaxOverlayNumber() + 1;
        var title = "Overlay " + num;

        // Add option:
        var o = new Elem("option")
            .attr("value", title)
            .text(title)
            .appendTo(s);
        s
            .attr("size", (l < 3 ? 3 : l))
            .val(title);

        // Add overlay:
        var ovr = new Elem(document.getElementById("overlay-source"))
            .clone(true)
            .attr("data-title", title)
            .attrRemove("id")
            .appendTo(document.getElementById("frontpage"))
            .get();

        // Clone form, if not exists:
        var b = document.querySelector("#table-overlay-global tbody");
        if (!b.innerHTML) {
            new Elem(document.querySelector("#overlay-form-source tbody"))
                .clone(true)
                .before(b);
            // Global change overlay attribute:
            document.getElementById("form-overlay").addEventListener("change", Overlay.changeForm);
            // Overlay background image:
            document.getElementById("form-overlay-button").addEventListener("click", Overlay.clickBackgroundButton);
            // Init select helpers:
            InputHelper.init(document.getElementById("form-overlay"));
            // Init color picker:
            new ColorPicker(document.getElementById("form-overlay-backgroundColor"));
        }

        document.getElementById("form-overlay-zIndex").value = 100 + num;

        return ovr;
    }

    static clickBackgroundButton (e) {
        e.preventDefault();
        backgroundSubject = Overlay.getActiveOverlay();
        inputImage.click();
    }

    static addOverlay (e) {
        e.preventDefault();

        // Create overlay:
        var ovr = Overlay.createOverlay();

        // Apply defaults:
        StyleManager.setDefaultValues(document.getElementById("form-overlay"), ovr);
    }

    static removeOverlay (e) {
        e.preventDefault();
        var ovr = Overlay.getActiveOverlay();
        if (!ovr) {
            return;
        }
        var opt = document.querySelector("#overlay-select-overlay option[value='" + ovr.getAttribute("data-title") + "']");
        var nxt = opt.nextElementSibling;
        nxt = nxt ? nxt : opt.previousElementSibling;
        if (nxt) {
            document.getElementById("overlay-select-overlay").value = nxt.value;
        }
        opt.parentNode.removeChild(opt);
        ovr.parentNode.removeChild(ovr);
    };

    static changeOverlay (e) {
        Transfer.attr2form(Overlay.getActiveOverlay(), e.target.closest("form"));
    };

    static getJson () {
        var data = {};
        for (var opt of document.querySelectorAll("#overlay-select-overlay option")) {
            var ovr = document.querySelector("#frontpage div.overlay[data-title='" + opt.value + "']");
            data[opt.value] = StyleManager.attr2json(ovr, document.getElementById("form-overlay"));
        }
        return data;
    }

    static getMaxOverlayNumber () {
        var max = 0, i;
        for (var el of document.querySelectorAll("#overlay-select-overlay option")) {
            i = parseInt(el.value.replace(/[^0-9]/g, ""));
            if (i > max) {
                max = i;
            }
        }
        return max;
    }

}