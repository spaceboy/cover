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

    static clickGoogleFontAdd (e) {
        e.preventDefault();
        var form = e.currentTarget.closest("form"),
            fontUrl = form.querySelector("input[name='url']").value,
            fontName = StyleManager.getGoogleFontName(fontUrl);

        // Include link element with font to HTML document:
        var el = document.createElement("link");
        el.href = fontUrl;
        el.rel = "stylesheet";
        el.setAttribute("data-type", "font");
        document.head.appendChild(el);

        StyleManager.addFontToSelect(fontName);

        // Clear form:
        form.querySelector("input[name='url']").value = "";
    }

    static clickFontUpload (e) {
        e.preventDefault();
        var fileUpload = new FileUpload(
            function (file) {
                var fr = new FileReader;
                fr.addEventListener(
                    "load",
                    e => {
                        // Find font type:
                        var ext = FileUpload.getFileExt(file.name);
                        var lookUp = {
                            "woff": "woff",
                            "woff2": "woff2",
                            "ttf": "truetype",
                            "otf": "opentype",
                            "svg": "svg"
                        }
                        var fontFormat = (
                            lookUp.hasOwnProperty(ext)
                            ? "format('" + lookUp[ext] + "')"
                            : ""
                        );
                        // Find font name:
                        var fontName = (
                            document.getElementById("upload-fonts-name").value.trim()
                            ? document.getElementById("upload-fonts-name").value.trim()
                            : file.name
                        ).replace(/\./g, '_');
                        // Create style element:
                        var el = document.createElement("style");
                        el.setAttribute("data-type", "font");
                        el.setAttribute("data-name", fontName);
                        el.innerHTML = "@font-face { font-family: '" + fontName + "'; src: url('" + e.target.result + "') " + fontFormat + "; }";
                        document.head.appendChild(el);
                        // Add font to selects:
                        StyleManager.addFontToSelect(fontName);
                        // Clear form:
                        document.getElementById("upload-fonts-name").value = "";
                    }
                );
                fr.readAsDataURL(file);
            },
            "font/",
            {}
        );
        fileUpload.upload();
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
