class Transfer {
    static attr2form (el, form) {
        var data = new FormData(form);
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
                case "none":
                    break;
                case "text":
                    inp.value = elActive.innerText;
                    break;
                case "html":
                    inp.value = elActive.innerHTML;
                    break;
                case "style":
                default:
                        inp.value = (
                        elActive.style[attr].startsWith("url(\"data:image")
                        ? "[IMAGE]"
                        : elActive.style[attr]
                    );
                    break;
            }
            inp.dispatchEvent(new Event("update"));
        }
    }

    static input2attr (inp, el) {
        if (inp.hasAttribute("data-target")) {
            el = el.querySelector(inp.getAttribute("data-target"));
        }
        switch (inp.getAttribute("data-method") ?? "style") {
            case "text":
                el.innerText = getValue(inp);
                break;
            case "html":
                el.innerHTML = getValue(inp);
                break;
            case "style":
            default:
                el.style[(inp.hasAttribute("data-attribute") ? inp.getAttribute("data-attribute") : inp.name)] = getValue(inp);
                break;
        }
    }

    static form2attr (form, el) {
        var data = new FormData(form);
        for (var a of data.entries()) {
            var inp = form.querySelector("*[name='" + a[0] + "']");
            if (inp.getAttribute("data-skip") == "true") {
                continue;
            }
            Transfer.input2attr(inp, el);
        }
    }

    static filter2attr (form, target) {
        var data = new FormData(form);
        var filter = [];
        var inp;
        var name;
        for (var el of data.keys()) {
            if (!el.match(/\.active$/)) {
                continue;
            }
            name = el.replace(/\.active$/, "");
            inp = form.querySelector("[name='" + name + ".value']");
            if (!inp.value) {
                continue;
            }
            filter.push(name + "(" + inp.value + (inp.getAttribute("data-postfix") ?? "") + ")");
        }
        if (!filter.length) {
            filter.push("none");
        }
        target.style.filter = filter.join(" ");
    }

    static attr2filter (el, form) {
        form.reset();
        var filter = el.style.filter;
        if (!filter || filter === "none") {
            return;
        }
        for (var i of filter.split(" ")) {
            var eff = i.match(/[a-z]+/)[0];
            var val = i.match(/\-?[0-9\.]+/)[0];
            if (val) {
                form.querySelector("[name='" + eff + ".active']").checked = true;
                form.querySelector("[name='" + eff + ".value']").value = val;
            }
        }
    }
}
