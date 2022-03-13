/*
 * require ColorTools
 */

class ColorPicker {

    input;

    button;

    /*
     * DOM entity input: <input type="text" class="color-picker-input" value="COLOR IN RGB(A), colorname, #HEX">
     * DOM entity button <input type="color" class="color-picker-button" value="COLOR IN #HEX"> -- if not given / not exists, create as next sibling of "input"
     */
    constructor (input, button) {
        (new Elem(input)).addClass("color-picker-input");
        this.input = input;

        if (button) {
            this.button = button;
        } else {
            this.button = new Elem("input")
            .attr({
                "class": "color-picker-button",
                "type": "color",
                "data-skip": "true"
            })
            .after(input)
            .get();
        }
        this.button.addEventListener(
            "change",
            (e) => {
                e.stopPropagation();
                this.input.value = this.button.value;
                this.input.dispatchEvent(
                    new Event(
                        "change",
                        {
                            "bubbles": true,
                            "currentTarget": this.input,
                            "target": this.input
                        }
                    )
                )
            }
        );
        this.input.addEventListener(
            "update",
            (e) => {
                this.button.value = ColorTools.convertToHex6(this.input.value);
            }
        );
        this.input.addEventListener(
            "change",
            (e) => {
                this.button.value = ColorTools.convertToHex6(this.input.value);
            }
        );
    }

}