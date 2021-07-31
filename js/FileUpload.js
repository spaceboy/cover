class FileUpload {
    
    onLoad;
    
    fileUpload;
    
    accept;
    
    constructor (onLoad, params, accept) {
        this.onLoad = onLoad;
        var fu = document.createElement("input");
        for (var i in params) {
            fu.setAttribute(i, params[i]);
        }
        fu.type = "file";
        //fu.style.display = "none";
        this.fileUpload = fu;
        this.accept = accept;
        fu.onchange = this.onChange.bind(this);
    }
    
    upload () {
        this.fileUpload.click();
    }
    
    onChange (e) {
        console.log("onChange");
        console.log(this);
        e.preventDefault();
        if (e.target.files.length < 1) {
            return;
        }
        if (this.accept && !e.target.files[0].type.startsWith(this.accept)) {
            console.log("not accept");
            console.log("get", e.target.files[0].type);
            console.log("expected", this.accept);
            return;
        }
        this.processFile.call(this, e.target.files[0]);
    }
    
    processFile (file) {
        console.log("FileUpload.processFile");
        this.onLoad(file);
    }
}

class FileUploadText extends FileUpload {
    processFile (file) {
        console.log("FileUploadText.processFile");
        console.log(this);
        console.log(this.onLoad);
        file.text()
            .then(
                function (text) {
                    this.onLoad.call(this, text);
                }
            )
            .catch(
                function (ex) {
                    console.log("catch");
                    console.log(ex);
                }
            );
    }
}

var up = new FileUploadText(
    function (text) {
        console.log("my func");
        console.log(text);
    },
    {
        "accept": "text/json"
    },
    "application/json"
);

