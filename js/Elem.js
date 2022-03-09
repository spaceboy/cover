class Elem {

    element;

    constructor (el) {
        if (!Elem.isDomObject(el)) {
            return this.create(el);
        }
        this.element = el;
        return this;
    }

    get () {
        return this.element;
    }

    create (name) {
        this.element = document.createElement(name);
        return this;
    }

    // Set attribute.
    // ELEMENT.attr("attribute", "value")
    // ELEMENT.attr({
    //   "attribute1": "value1",
    //   ..
    //   "attributeN": "valueN",
    // })
    attr (name, value) {
        if (name && value) {
            this.element.setAttribute(name, value);
            return this;
        }
        if (name) {
            for (var i in name) {
                this.element.setAttribute(i, name[i]);
            }
        }
        return this;
    }

    html (value) {
        this.element.innerHTML = value;
        return this;
    }

    text (value) {
        this.element.innerText = value;
        return this;
    }

    clone (deep) {
        this.element = this.element.cloneNode(deep);
        return this;
    }

    after (el) {
        el.parentNode.insertBefore(this.element, el.nextSibling);
        return this;
    }

    before (el) {
        el.parentNode.insertBefore(this.element, el);
        return this;
    }

    append (el) {
        el.appendChild(this.element);
        return this;
    }

    prev () {
        return this.element.previousSibling;
    }

    next () {
        return this.element.nextSibling;
    }

    parent () {
        return this.element.parentNode;
    }

    wrap (el) {
        el.parentNode.insertBefore(this.element, el).appendChild(el.cloneNode(true));
        el.remove();
        return this;
    }

    addClass (className) {
        var a = this.#getClassArray();
        if (false === this.#inArray(className, a)) {
            a.push(className);
        }
        this.element.setAttribute("class", a.join(" "));
        return this;
    }

    removeClass (className) {
        var a = this.#getClassArray();
        var i = this.#inArray(className, a);
        if (false !== i) {
            a.splice(i, 1);
        }
        this.element.setAttribute("class", a.join(" "));
        this.clearClass();
        return this;
    }

    toggleClass (className) {
        var a = this.#getClassArray();
        var i = this.#inArray(className, a);
        if (false === i) {
            a.push(className);
        } else {
            a.splice(i, 1);
        }
        this.element.setAttribute("class", a.join(" "));
        this.clearClass();
        return this;
    }

    clearClass () {
        if (this.element.hasAttribute("class") && !this.element.getAttribute("class")) {
            this.element.removeAttribute("class");
        }
        return this;
    }

    hasClass (className) {
        return this.#inArray(className, this.#getClassArray());
    }

    static isDomObject (obj) {
        if (obj instanceof HTMLElement) {
            return true;
        }
        return typeof obj === "object"
            && obj.nodeType === 1
            && typeof obj.style === "object"
            && typeof obj.ownerDocument === "object";
    }

    #getClassArray () {
        return (
            this.element && this.element.hasAttribute("class") && this.element.getAttribute("class")
            ? this.element.getAttribute("class").trim().replace(/\s+/, " ").split(" ")
            : []
        );
    }

    #inArray (needle, haystack) {
        for (var i = 0, l = haystack.length; i < l; ++i) {
            if (haystack[i] === needle) {
                return i;
            }
        }
        return false;
    }
}