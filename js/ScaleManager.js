class ScaleManager {
    
    scale = 1.0;
    source;
    target;
    
    constructor (source, target) {
        this.source = source;
        this.target = target;
        var t = this;
        source.addEventListener(
            "change",
            function () {
                scaleManager.setSize.call(t)
            }
        );
    }
    
    getScale () {
        return this.target.style.transform;
    }
    
    setScale (scale) {
        this.target.style.transform = scale;
        this.target.style.msTransform = scale;
        this.target.style.MozTransform = scale;
        this.target.style.OTransform = scale;
        this.target.style.WebkitTransform = scale;
    }
    
    setSize () {
        var s = this.source.value.split("×");
        if (s.length !== 2) {
            return;
        }
        this.scale = 500 / s[0];
        this.target.style.height = s[1] + "px";
        this.target.style.width = s[0] + "px";
        this.setScale("scale(" + this.scale + ")");
    }
}
