import { GameObject } from "./gameObject.js";

export class Ball extends GameObject {

    constructor(x, y, width, height) {
        super(x, y, width, height)
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

}