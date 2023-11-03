import {
    GameObject
} from "./gameObject.js";

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
        setCustomProperty(this.ballElement, "bottom", this.y + "px");
    }
}