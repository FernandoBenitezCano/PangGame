import { GameObject } from "./gameObject.js";
import { setCustomProperty } from "./updateProperties.js";

export class Ball extends GameObject {

    constructor(x, y, height, width) {
        super(x, y, height, width)
        this.setElement();
    }

    setElement() {
        this.ballElement = document.createElement("div");
        this.ballElement.classList.add("ball");
        setCustomProperty(this.ballElement, "height", this.height + "px");
        setCustomProperty(this.ballElement, "width", this.width + "px");
    }

    getElement() {
        return this.ballElement;
    }

}