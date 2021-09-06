class InputHelper {
    static init (area) {
        for (var el of area.querySelectorAll("select.helper")) {
            var i = document.createElement("input");
            i.id = el.id;
            el.id = el.id + "-helper";
            i.name = el.name;
            el.name = el.name + "-helper";
            i.setAttribute("class", "helper");
            el.setAttribute("data-change", "ignore");
            el.setAttribute("data-method", "none");
            el.setAttribute("data-skip", "true");
            el.before(i);
            el.addEventListener(
                "change",
                function (e) {
                    e.stopPropagation();
                    var t = e.currentTarget;
                    var el = t.previousSibling;
                    el.value = t.value;
                    el.dispatchEvent(
                        new Event(
                            "change",
                            {
                                "bubbles": true
                            }
                        )
                    );
                }
            )
        }
    }
}
