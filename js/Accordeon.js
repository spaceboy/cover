class Accordeon {
    constructor (parent) {
        for (var title of parent.querySelectorAll("h3")) {
            document.getElementById(title.getAttribute("data-accordeon")).style.display = "none";
            title.addEventListener(
                "click",
                function (e) {
                    var body = document.getElementById(e.currentTarget.getAttribute("data-accordeon"));
                    var display = (body.style.display === "none" ? "block" : "none");
                    for (var el of parent.querySelectorAll("h3")) {
                        document.getElementById(el.getAttribute("data-accordeon")).style.display = "none";
                    }
                    body.style.display = display;
                }
            );
            title.style.cursor = "pointer";
        }
    }
}
