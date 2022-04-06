class StyleManager {

    frontpage;
    textarea;
    buttonShow;
    buttonApply;
    buttonDownload;
    buttonUpload;

    constructor (frontpage, textarea, buttonShow, buttonApply, buttonDownload, buttonUpload) {
        this.frontpage = frontpage;
        this.textarea = textarea;
        buttonShow.onclick = this.getStyle.bind(this);
        this.buttonShow = buttonShow;
        buttonApply.onclick = this.applyStyle.bind(this);
        this.buttonApply = buttonApply;
        buttonDownload.onclick = this.downloadJson.bind(this);
        this.buttonDownload = buttonDownload;
        buttonUpload.onclick = this.uploadJson.bind(this);
        this.buttonUpload = buttonUpload;
    }

    #loadFormElement (data, form, target) {
        form.reset();
        for (var el in data) {
            var inp = form.querySelector("*[name='" + el + "']");
            if (inp) {
                inp.value = data[el];
            }
        }
        Transfer.form2attr(form, target);
        if (data["backgroundImage"].startsWith("url(\"data:image")) {
            form.querySelector("input[name='backgroundImage']").value = "[IMAGE]";
        }
    }

    /**
     * Set default values of form elements (where declared in data-default attribute).
     * When target element is declared, apply the defaults to canvas.
     */
    static setDefaultValues (form, target) {
        for (var i of form.querySelectorAll("*[data-default]")) {
            i.value = i.getAttribute("data-default");
        }
        if (target) {
            Transfer.form2attr(form, target);
        }
    }

    static attr2json (el, form) {
        var data = new FormData(form);
        var json = {};
        for (var a of data.entries()) {
            var inp = form.querySelector("*[name='" + a[0] + "']");
            if (inp.getAttribute("data-skip") == "true") {
                continue;
            }
            var elActive = (
                inp.hasAttribute("data-target")
                ? el.querySelector(inp.getAttribute("data-target"))
                : el
            );
            var attr = (inp.hasAttribute("data-attribute") ? inp.getAttribute("data-attribute") : a[0]);
            switch (inp.getAttribute("data-method") ?? "style") {
                case "text":
                    json[a[0]] = elActive.innerText;
                    break;
                case "html":
                    json[a[0]] = elActive.innerHTML;
                    break;
                case "style":
                default:
                    json[a[0]] = elActive.style[attr];
                    break;
            }
        }
        return json;
    }

    filter2json (form) {
        var data = new FormData(form);
        var json = {};
        for (var e of data.entries()) {
            if (!e[0].match(/\.active$/)) {
                continue;
            }
            var name = e[0].replace(/\.active$/, "");
            json[name] = form.querySelector("*[name='" + name + ".value']").value;
        }
        return json;
    }

    static getGoogleFontName (href) {
        var url = new URL(href);
        var params = new URLSearchParams(url.search);
        return params.get("family");
    }

    // Insert font to selects:
    static addFontToSelect (fontName) {
        var o = document.createElement("option");
        o.value = fontName;
        o.innerText = fontName;
        document.querySelector("#form form select[name='fontFamily']").appendChild(o);
    }

    static slugify(s) {
        var r = {
            'á': 'a',
            'ä': 'ae',
            'č': 'c',
            'ď': 'd',
            'é': 'e',
            'ě': 'e',
            'ë': 'e',
            'í': 'i',
            'ľ': 'l',
            'ň': 'n',
            'ó': 'o',
            'ö': 'oe',
            'ř': 'r',
            'š': 's',
            'ť': 't',
            'ú': 'u',
            'ů': 'u',
            'ü': 'ue',
            'ý': 'y',
            'ž': 'z',
            '+': ' plus ',
            '&': ' a ',
            '€': 'eur'
        };
        s = s.trim().toLowerCase();
        for (var i in r) {
            s = s.replaceAll(i, r[i]);
        }
        return s.replace(/[^a-z]/g, '-').replace(/\-+/g, '-');
    }

    static getProjectFilename (ext) {
        var fileName = StyleManager.slugify(StyleManager.getProjectTitle());
        if (StyleManager.getProjectVersion()) {
            fileName += "." + StyleManager.getProjectVersion()
        }
        return (ext ? fileName + "." + ext : fileName);
    }

    static getProjectSize () {
        return document.getElementById("project-settings-size").value;
    }

    static getProjectTitle () {
        var t = document.getElementById("project-settings-title").value.trim();
        return (t ? t : "untitled");
    }

    static getProjectVersion () {
        return document.getElementById("project-settings-version").value;
    }

    // Copy style to JSON box
    getStyle () {
        // Panels:
        var panels = [];
        var panelActiveOriginal = panelActive;
        for (var el of document.querySelectorAll("#frontpage > div.wrapper")) {
            Panel.selectPanel(el);
            var panel = StyleManager.attr2json(el, document.getElementById("attributes"));
            panel["panelTitle"] = el.getAttribute("data-title");
            panel["panelFilters"] = this.filter2json(document.getElementById("filters-panel"));
            panels.push(panel);
        }
        if (panelActiveOriginal) {
            Panel.selectPanel(panelActiveOriginal);
        }
        // Fonts:
        var fontsGoogle = {};
        for (var el of document.head.querySelectorAll("link[data-type='font']")) {
            var href = el.getAttribute("href");
            fontsGoogle[StyleManager.getGoogleFontName(href)] = href;
        }
        var fontsUpload = {};
        for (var el of document.head.querySelectorAll("style[data-type='font']")) {
            fontsUpload[el.getAttribute("data-name")] = el.innerHTML;
        }
        // Result:
        this.textarea.value = JSON.stringify(
            {
                "about": [
                    "This is data file for free to use e-book cover generator",
                    "https://spaceboy.github.io/cover/",
                    "Developed by Spaceboy.",
                    "Before you start editing this file, make sure you know what you are doing.",
                ],
                "project": {
                    "title": StyleManager.getProjectTitle(),
                    "version": StyleManager.getProjectVersion(),
                    "size": StyleManager.getProjectSize(),
                    "revisionDate": (new Date()).toUTCString()
                },
                "panels": panels,
                "background": StyleManager.attr2json(frontpage, document.getElementById("background")),
                "filters": this.filter2json(document.getElementById("filters")),
                "overlays": Overlay.getJson(),
                "fonts": {
                    "google": fontsGoogle,
                    "upload": fontsUpload
                }
            },
            null,
            4
        );
    }

    loadFormFilter (data, form, target) {
        form.reset();
        for (var el in data) {
            var inp = form.querySelector("*[name='" + el + ".value']");
            inp.value = data[el];
            form.querySelector("*[name='" + el + ".active']").checked = true;
        }
        Transfer.filter2attr(form, target);
    }

    // Copy style from JSON box
    applyStyle () {
        var data = JSON.parse(this.textarea.value);
        var source = document.getElementById("panel-source");

        // Load fonts:
        if (data.hasOwnProperty("fonts")) {
            if (data["fonts"].hasOwnProperty("google")) {
                for (var f in data["fonts"]["google"]) {
                    var el = document.createElement("link");
                    el.href = data["fonts"]["google"][f];
                    el.rel = "stylesheet";
                    el.setAttribute("data-type", "font");
                    document.head.appendChild(el);
                    StyleManager.addFontToSelect(f);
                }
            }
            //StyleManager.addFontToSelect()
            if (data["fonts"].hasOwnProperty("upload")) {
                for (var f in data["fonts"]["upload"]) {
                    var el = document.createElement("style");
                    el.setAttribute("data-type", "font");
                    el.setAttribute("data-name", f);
                    el.innerHTML = data["fonts"]["upload"][f];
                    document.head.appendChild(el);
                    StyleManager.addFontToSelect(f);
                }
            }
        }

        // Load panels:
        for (var el of this.frontpage.querySelectorAll("div.wrapper")) {
            this.frontpage.removeChild(el);
        }
        var form = document.getElementById("attributes");
        var select = document.getElementById("panel-select-panel");
        select.innerHTML = "";
        for (var i = 0, l = data["panels"].length; i < l; i++) {
            panelActive = frontpage.appendChild(source.cloneNode(true));
            panelActive.style.display = "";
            panelActive.setAttribute("id", "panel-" + i);
            this.#loadFormElement(data["panels"][i], form, panelActive);
            if (data["panels"][i].hasOwnProperty("panelFilters")) {
                this.loadFormFilter(data["panels"][i]["panelFilters"], document.getElementById("filters-panel"), panelActive);
            }
            var panelTitle = (
                data["panels"][i].hasOwnProperty("panelTitle")
                ? data["panels"][i]["panelTitle"]
                : "Panel " + (i + 1)
            );
            panelActive.setAttribute("data-title", panelTitle);
            var o = document.createElement("option");
            o.value = panelTitle;
            o.text = panelTitle;
            select.appendChild(o);
        }
        Panel.selectPanel(panelActive);

        // Load filters:
        this.loadFormFilter(data["filters"], document.getElementById("filters"), frontpage);

        // Load background:
        this.#loadFormElement(data["background"], document.getElementById("background"), frontpage);

        // Remove existing overlays:
        for (var el of document.querySelectorAll("#overlay-select-overlay option")) {
            el.parentNode.removeChild(el);
        }
        for (var el of document.querySelectorAll("#frontpage div.overlay")) {
            el.parentNode.removeChild(el);
        }

        // Load overlay(s):
        if (data.hasOwnProperty("overlay")) {
            // Single overlay (old method):
            this.#loadFormElement(data["overlay"], document.getElementById("form-overlay"), Overlay.createOverlay());
        } else if (data.hasOwnProperty("overlays")) {
            // Multiple overlay (new method):
            for (var el in data["overlays"]) {
                this.#loadFormElement(data["overlays"][el], document.getElementById("form-overlay"), Overlay.createOverlay());
            }
        }

        // Project settings:
        if (data.hasOwnProperty("project")) {
            if (data["project"].hasOwnProperty("title")) {
                document.getElementById("project-settings-title").value = data["project"]["title"];
            }
            if (data["project"].hasOwnProperty("version")) {
                document.getElementById("project-settings-version").value = data["project"]["version"];
            }
            if (data["project"].hasOwnProperty("size")) {
                document.getElementById("project-settings-size").value = data["project"]["size"];
                scaleManager.setSize();
            }
        } else {
            StyleManager.setDefaultValues(document.getElementById("project-settings"));
        }
    }

    downloadJson () {
        this.getStyle();
        var link = document.createElement("a");
        link.download = StyleManager.getProjectFilename("json");
        link.href =  "data:text/json;charset=utf-8," + encodeURIComponent(this.textarea.value);
        link.click();
    }

    uploadJson () {
        document.getElementById("splash").display = "block";
        var fileUpload = document.createElement("input");
        fileUpload.type = "file";
        fileUpload.accept = "text/json";
        fileUpload.style.display = "none";
        var t = this;
        fileUpload.addEventListener(
            "change",
            function (e) {
                e.preventDefault();
                if (e.target.files.length < 1) {
                    return;
                }
                if (!e.target.files[0].type.startsWith("application/json")) {
                    return;
                }
                e.target.files[0].text()
                    .then(
                        function (text) {
                            t.textarea.value = text;
                            t.applyStyle();
                            document.getElementById("splash").display = "none";
                        }
                    )
                    .catch(
                        function (ex) {
                            document.getElementById("splash").display = "none";
                        }
                    );
            }
        );
        fileUpload.click();
    }
}
