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
        setCustomProperty(this.ballElement, "left", this.x + "px");
        setCustomProperty(this.ballElement, "top", this.y + "px");
    }

    getElement() {
        return this.ballElement;
    }

    updateBall() {
        this.y = this.y + this.velocity;
        this.x = this.x + this.velocity;
        setCustomProperty(this.ballElement, "left", this.x + "px");
        setCustomProperty(this.ballElement, "top", this.y + "px");

    }
}