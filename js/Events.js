class Events {
    static clickDownload (e) {
        e.preventDefault();
        var scale = scaleManager.getScale();
        scaleManager.setScale("scale(1.0)");
        document.getElementById("frontpage").style.overflow = "hidden";
        var splash = document.getElementById("splash");
        splash.style.display = "block";
        domtoimage
            .toJpeg(
                document.getElementById("frontpage"),
                {
                    quality: 0.95
                }
            )
            .then(function (dataUrl) {
                scaleManager.setScale(scale);
                splash.style.display = "none";
                var link = document.createElement('a');
                link.download = 'my-image-name.jpeg';
                link.href = dataUrl;
                link.click();
                //document.removeChild(link);
            })
            .catch(function (error) {
                scaleManager.setScale(scale);
                splash.style.display = "none";
                alert("ERROR\n" + error);
            });
    }

    static clickFontAdd (e) {
        e.preventDefault();
        var form = e.currentTarget.closest("form"),
            fontName = form.querySelector("input[name='name']").value,
            fontUrl = form.querySelector("input[name='url']").value

        // Include style element with font to HTML document:
        var el = document.createElement("link");
        el.href = fontUrl;
        el.rel = "stylesheet";
        document.head.appendChild(el);

        // Insert font to select:
        var o = document.createElement("option");
        o.value = fontName;
        o.innerText = fontName;
        document.querySelector("#form form select[name='fontFamily']").appendChild(o);

        // Clear form:
        form.querySelector("input[name='name']").value = "";
        form.querySelector("input[name='url']").value = "";
    }

    static changeFilters (e) {
        if (e.target.type !== "checkbox") {
            e.target.closest("tr").querySelector("input[type='checkbox']").checked = true;
        }
        var form = e.currentTarget;
        Transfer.filter2attr(form, document.getElementById("frontpage"));
    }

    static changeBackground (e) {
        if (e.currentTarget.getAttribute("data-change" === "ignore")) {
            return;
        }
        Transfer.input2attr(e.target, document.getElementById("frontpage"));
    }

    static changePanelFilter (e) {
        if (!panelActive) {
            return;
        }
        if (e.target.type !== "checkbox") {
            e.target.closest("tr").querySelector("input[type='checkbox']").checked = true;
        }
        var form = e.currentTarget;
        Transfer.filter2attr(form, panelActive);
    }

    static clickImageButton (e) {
        e.preventDefault();
        backgroundSubject = (
            e.currentTarget.id === "background-button" || !panelActive
            ? document.getElementById("frontpage")
            : panelActive
        );
        inputImage.click();
    }
    
    static clickOverlayButton (e) {
        e.preventDefault();
        backgroundSubject = document.getElementById("overlay");
        inputImage.click();
    }

    static changeOverlay (e) {
        Transfer.input2attr(e.target, document.getElementById("overlay"));
    }
    
    static clickOverlay () {
        var checkbox = document.getElementById("form-overlay-display");
        checkbox.checked = false;
        checkbox.dispatchEvent(
            new Event(
                "change",
                {
                    "bubbles": true,
                    "currentTarget": document.getElementById("form-overlay-display")
                }
            )
        );
    }
    
};
