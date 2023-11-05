import { GameObject } from "./gameObject.js";
import { setCustomProperty } from "./updateProperties.js";

export class Ball extends GameObject {
  speedX = 5; 
  speedY = 5;

  constructor(x, y, height, width, gameBoardElement) {
    super(x, y, height, width);
    this.gameBoardElement = gameBoardElement;
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
