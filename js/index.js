// Startup:

var panelActive;

var frontpage = document.getElementById("frontpage");

var scaleManager = new ScaleManager(document.getElementById("project-settings-size"), frontpage);

// Upload, download, edit as JSON:
new StyleManager(
    frontpage,
    document.getElementById("jsonText"),
    document.getElementById("jsonShow"),
    document.getElementById("jsonApply"),
    document.getElementById("jsonDownload"),
    document.getElementById("jsonUpload"),
);

// Load fonts:
var fontManager = new FontManager({
    "Amita": "Amita",
    "Bangers": "Bangers",
    "Berkshire+Swash": "Berkshire Swash",
    "Black+Ops+One": "Black Ops One",
    "Bungee": "Bungee",
    "Cantora+One": "Cantora One",
    "Cinzel": "Cinzel",
    "Concert+One": "Concert One",
    "Courgette": "Courgette",
    "Emblema+One": "Emblema One",
    "Fredericka+the+Great": "Fredericka the Great",
    "Fruktur": "Fruktur",
    "Charm": "Charm",
    "Imbue": "Imbue",
    "Karma:wght@500": "Karma",
    "Libre+Baskerville": "Libre Baskerville",
    "Lobster": "Lobster",
    "MedievalSharp": "MedievalSharp",
    "Milonga": "Milonga",
    "Mirza": "Mirza",
    "Mitr": "Mitr",
    "Neuton": "Neuton",
    "Nosifer": "Nosifer",
    "Oleo+Script": "Oleo Script",
    "Pangolin": "Pangolin",
    "Roboto": "Roboto",
    "Rye": "Rye",
    "Sigmar+One": "Sigmar One",
    "Sriracha": "Sriracha",
    "STIX+Two+Math": "STIX Two Math",
    "Vollkorn:wght@500": "Vollkorn"
});
fontManager.createOptions(document.getElementById("attributes-fontFamily"));
fontManager.loadStyle();

// Manage frontpage scale:
scaleManager.setSize();

var backgroundSubject;
var fr = new FileReader;
fr.addEventListener(
    "load",
    e => {
        backgroundSubject.style.backgroundImage = "url('" + e.target.result + "')";
        if (backgroundSubject.id === "frontpage") {
            document.querySelector("#background input[name='backgroundImage']").value = "[IMAGE]";
        }
    }
);

var inputImage = document.createElement("input");
inputImage.type = "file";
inputImage.accept = "image/*";
inputImage.style.display = "none";
inputImage.addEventListener(
    "change",
    e => {
        e.preventDefault();
        if (e.target.files.length < 1) {
            return;
        }
        if (!e.target.files[0].type.startsWith("image/")) {
            return;
        }
        fr.readAsDataURL(e.target.files[0]);
    }
);

function getValue (el) {
    switch (el.tagName) {
        case "SELECT":
            var o = el.querySelector("option:checked");
            if (!o) {
                return null;
            }
            return (
                o.hasAttribute("value")
                ? o.getAttribute("value")
                : o.innerText
            );
            break;
        default:
            return el.value;
    }
}

// Apply input helper:
InputHelper.init(document.getElementById("attributes"));
InputHelper.init(document.getElementById("background"));

// Select/move/remove/add panel:
document.getElementById("frontpage").addEventListener("click", Panel.selectByClick);
document.getElementById("panel-select-panel").addEventListener("change", Panel.selectBySelector);
document.getElementById("panel-select-move-up").addEventListener("click", Panel.panelMoveUp)
document.getElementById("panel-select-move-dn").addEventListener("click", Panel.panelMoveDn)
document.getElementById("panel-select-add").addEventListener("click", Panel.panelAdd)
document.getElementById("panel-select-remove").addEventListener("click", Panel.panelRemove)

// Panel change attribute:
document.querySelector("#form form.attributes").addEventListener("change", Panel.update);

// Global change background attribute:
document.getElementById("background").addEventListener("change", Events.changeBackground);

// Load background attributes from image:
Transfer.attr2form(document.getElementById("frontpage"), document.getElementById("background"));

// Overlay clicked:
//document.getElementById("overlay").addEventListener("click", Events.clickOverlay);

// Init overlay manager:
Overlay.init();

// Init overlay form:
//Transfer.attr2form(document.getElementById("overlay"), document.getElementById("form-overlay"));

// Add font:
document.querySelector("#google-fonts input[name='add']").addEventListener("click", Events.clickGoogleFontAdd);
document.querySelector("#upload-fonts input[name='add']").addEventListener("click", Events.clickFontUpload);

// Init "size" attribute inputs:
for (var e of document.querySelectorAll("#form [data-type='size']")) {
    new SizeElement(e);
}

// Panel background image:
document.getElementById("image-button").addEventListener("click", Events.clickImageButton);

// Global background image:
document.getElementById("background-button").addEventListener("click", Events.clickImageButton);

// Image download:
document.getElementById("download").addEventListener("click", Events.clickDownload);

// Global filter settings:
document.getElementById("filters").addEventListener("change", Events.changeFilters);

// Panel filter settings:
document.getElementById("filters-panel").addEventListener("change", Events.changePanelFilter);

// Init accordeons:
new Accordeon(document.getElementById("form"));
document.querySelector("#form h3").dispatchEvent(new Event("click"));
new Accordeon(document.getElementById("global"));
document.querySelector("#global h3").dispatchEvent(new Event("click"));

// Init colorpickers:
for (var el of document.querySelectorAll(".color-picker > input")) {
    new ColorPicker(el);
}

// Init theme selector:
var t = new Themes(
    document.getElementById("themes-source"),
    document.querySelector("#theme-item-source > figure"),
    document.getElementById("jsonApply")
);

/*
document.getElementById("share-fb").addEventListener("click", function (e) {
    console.log("click");
    //console.log(FB);

    FB.getLoginStatus(
        function (response) {
            console.log(response);
        },
        true
    );

    console.log(FB.getUserID());
    console.log(FB.getAccessToken());

    var mimeType = "image/png";
    /*
    var fd = new FormData();
    fd.append("access_token", accessToken);
    try {
        fd.append("source", dataURItoBlob(imageData, mimeType));
    } catch (ex) {
        console.log(ex);
    }
    fd.append("message","Kiss");

    try {
        $.ajax({
             url:"https://graph.facebook.com/" + <<userID received on getting user details>> + "/photos?access_token=" + <<user accessToken>>,
             type:"POST",
             data:fd,
             processData:false,
             contentType:false,
             cache:false,
             success:function(data){
                 console.log("success " + data);
             },
             error:function(shr,status,data){
                 console.log("error " + data + " Status " + shr.status);
             },
             complete:function(){
                 console.log("Ajax Complete");
             }
        });

     } catch(e) {
         console.log(e);
     }
   */
//});
