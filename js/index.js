// Startup:

var panelActive;

var frontpage = document.getElementById("frontpage");

var scaleManager = new ScaleManager(document.getElementById("size-size"), frontpage);

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
    "Cinzel": "Cinzel",
    "Concert+One": "Concert One",
    "Courgette": "Courgette",
    "Fredericka+the+Great": "Fredericka the Great",
    "Libre+Baskerville": "Libre Baskerville",
    "Lobster": "Lobster",
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


// Select panel:
document.getElementById("frontpage").addEventListener("click", Panel.selectByClick);
document.getElementById("panel-select-panel").addEventListener("change", Panel.selectBySelector);
// Panel change attribute:
document.querySelector("#form form.attributes").addEventListener("change", Panel.update);
// Add panel:
document.getElementById("panel-add-panel").addEventListener("click", Panel.addPanel);
// Global change background attribute:
document.getElementById("background").addEventListener("change", Events.changeBackground);
// Load background attributes from image:
Transfer.attr2form(document.getElementById("frontpage"), document.getElementById("background"));
// Add font:
document.querySelector("#fonts input[name='add']").addEventListener("click", Events.clickFontAdd);
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
