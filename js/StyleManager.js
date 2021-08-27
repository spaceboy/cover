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
            inp.value = data[el];
        }
        Transfer.form2attr(form, target);
        if (data["backgroundImage"].startsWith("url(\"data:image")) {
            form.querySelector("input[name='backgroundImage']").value = "[IMAGE]";
        }
    }

    attr2json (el, form) {
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

    getStyle () {
        var panels = [];
        for (var el of document.querySelectorAll("#frontpage > div.wrapper")) {
            panels.push(this.attr2json(el, document.getElementById("attributes")));
        }
        var style = {
            "panels": panels,
            "background": this.attr2json(frontpage, document.getElementById("background")),
            "filters": this.filter2json(document.getElementById("filters"))
        };
        this.textarea.value = JSON.stringify(style, null, 4);
    }

    applyStyle () {
        var data = JSON.parse(this.textarea.value);
        var source = document.getElementById("panel-source");
        var loadFormFilter = function (data, form, target) {
            form.reset();
            for (var el in data) {
                var inp = form.querySelector("*[name='" + el + ".value']");
                inp.value = data[el];
                form.querySelector("*[name='" + el + ".active']").checked = true;
            }
            Transfer.filter2attr(form, frontpage);
        }

        // Load panels:
        for (var el of this.frontpage.querySelectorAll("div.wrapper")) {
            this.frontpage.removeChild(el);
        }
        var form = document.getElementById("attributes");
        for (var i = 0, l = data["panels"].length; i < l; i++) {
            panelActive = frontpage.appendChild(source.cloneNode(true));
            panelActive.style.display = '';
            panelActive.setAttribute("id", "panel-" + i);
            this.#loadFormElement(data["panels"][i], form, panelActive);
        }

        // Load filters:
        loadFormFilter(data["filters"], document.getElementById("filters"), frontpage);

        // Load background:
        this.#loadFormElement(data["background"], document.getElementById("background"), frontpage);
    }

    downloadJson () {
        this.getStyle();
        var link = document.createElement('a');
        link.download = 'my-project-name.json';
        link.href =  "data:text/json;charset=utf-8," + encodeURIComponent(this.textarea.value);
        link.click();
    }

    uploadJson () {
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
                        }
                    )
                    .catch(
                        function (ex) {
                        }
                    );
            }
        );
        fileUpload.click();
    }
}
