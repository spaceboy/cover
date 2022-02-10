class Elem {

    element;

    constructor (el) {
        if (el) {
            this.element = el;
        }
        return this;
    }

    get () {
        return this.element;
    }

    create (name) {
        this.element = document.createElement(name);
        return this;
    }

    attr (name, value) {
        this.element.setAttribute(name, value);
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
}