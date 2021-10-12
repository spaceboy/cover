class FileUpload {

    onLoad;

    fileUpload;

    acceptStart;

    constructor (onLoad, accept, params) {
        this.onLoad = onLoad;
        this.acceptStart = accept;
        var fu = document.createElement("input");
        fu.type = "file";
        fu.style.display = "none";
        for (var i in params) {
            fu.setAttribute(i, params[i]);
        }
        fu.onchange = this.onChange.bind(this);
        this.fileUpload = fu;
    }

    upload () {
        this.fileUpload.click();
    }

    static getFileExt (fileName) {
        var ext = fileName.split(".");
        return (
            ext.length
            ? ext.pop()
            : fileName
        );
    }

    onChange (e) {
        e.preventDefault();
        if (e.target.files.length < 1) {
            return;
        }
        if (this.acceptStart && !e.target.files[0].type.startsWith(this.acceptStart)) {
            alert("File type mismatch.\nExpected\"" + this.acceptStart + "\"\nget \"" + e.target.files[0].type + "\"");
            return;
        } else {
            this.processFile.call(this, e.target.files[0]);
        }
    }

    processFile (file) {
        this.onLoad(file);
    }
}