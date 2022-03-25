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

    // Set attribute(s);
    // when called with one string parameter, return attribute value.
    // ELEMENT.attr("attribute", "value")
    // ELEMENT.attr({
    //   "attribute1": "value1",
    //   ..
    //   "attributeN": "valueN",
    // })
    attr (name, value) {
        if (name && value !== undefined) {
            this.element.setAttribute(name, value);
            return this;
        }
        if (name) {
            if (typeof name === "string" || name instanceof String) {
                return this.element.getAttribute(name);
            }
            for (var i in name) {
                this.element.setAttribute(i, name[i]);
            }
        }
        return this;
    }

    // Remove attribute on active element.
    attrRemove (name) {
        this.element.removeAttribute(name);
        return this;
    }

    // Set active element's innerHTML.
    html (value) {
        this.element.innerHTML = value;
        return this;
    }

    // Set active element's innerText.
    text (value) {
        this.element.innerText = value;
        return this;
    }

    // Create and return active element's clone.
    clone (deep) {
        this.element = this.element.cloneNode(deep);
        return this;
    }

    // Place active element AFTER given element.
    after (el) {
        if (el instanceof Elem) {
            el = el.get();
        }
        el.parentNode.insertBefore(this.element, el.nextSibling);
        return this;
    }

    // Place active element BEFORE given element.
    before (el) {
        if (el instanceof Elem) {
            el = el.get();
        }
        el.parentNode.insertBefore(this.element, el);
        return this;
    }

    // Append active element to given element.
    appendTo (el) {
        (el instanceof Elem ? el.get() : el).appendChild(this.element);
        return this;
    }

    // Append given element to active element.
    append (el) {
        this.element.appendChild(el instanceof Elem ? el.get() : el);
        return this;
    }

    // Get previous sibling of active element.
    prev () {
        return this.element.previousSibling;
    }

    // Get next sibling of active element.
    next () {
        return this.element.nextSibling;
    }

    // Get parent of active element.
    parent () {
        return this.element.parentNode;
    }

    // Wrap given element by active element.
    wrap (el) {
        if (el instanceof Elem) {
            el = el.get();
        }
        el.parentNode.insertBefore(this.element, el).appendChild(el.cloneNode(true));
        el.remove();
        return this;
    }

    // Add CSS class to active element.
    addClass (className) {
        var a = this.#getClassArray();
        if (false === this.#inArray(className, a)) {
            a.push(className);
        }
        this.element.setAttribute("class", a.join(" "));
        return this;
    }

    // Remove CSS class from active element.
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

    // Toggle CSS class on active element.
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

    // Clear attribute "class" on active element.
    clearClass () {
        if (this.element.hasAttribute("class") && !this.element.getAttribute("class")) {
            this.element.removeAttribute("class");
        }
        return this;
    }

    // Detect whether active element has given CSS class or not.
    hasClass (className) {
        return this.#inArray(className, this.#getClassArray());
    }

    // Return count of child nodes.
    // When qs is set, return count of matching querySelectorAll nodes.
    childCount (qs) {
        if (qs) {
            return this.element.querySelectorAll(qs).length;
        }
        return this.element.childNodes.length;
    }

    // Return value of active element;
    // when value is set, set value to ective element and return this.
    val (value) {
        if (value === undefined) {
            return this.element.value;
        }
        this.element.value = value;
        return this;
    }

    // Detect whether given object is a DOM object.
    static isDomObject (obj) {
        if (obj instanceof HTMLElement) {
            return true;
        }
        return typeof obj === "object"
            && obj.nodeType === 1
            && typeof obj.style === "object"
            && typeof obj.ownerDocument === "object";
    }

    // Swap given nodes (DOM elements).
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