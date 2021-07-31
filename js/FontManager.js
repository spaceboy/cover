class FontManager {

    fonts = {};
    
    constructor (fonts) {
        this.fonts = fonts;
        return this;
    }
    
    loadStyle () {
        var o = [];
        for (var i in this.fonts) {
            o.push(i);
        }

        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                var style = document.createElement("style");
                style.innerHTML = ajax.responseText;
                document.body.appendChild(style);
            }
        }
        ajax.open("GET", "https://fonts.googleapis.com/css2?family=" + o.join("&family=") + "&display=swap", true);
        ajax.send();
        return this;
    }
    
    createOptions (target) {
        for (var i in this.fonts) {
            var el = document.createElement("option");
            el.value = this.fonts[i];
            el.text = this.fonts[i];
            target.appendChild(el);
        }
        return this;
    }
}
