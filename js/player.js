
import { GameObject } from "./gameObject.js";

export class Player extends GameObject {
  playerSpeed = 15;

  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.setElement();
  }

  setElement() {

    this.playerElement = document.createElement("div");
    this.playerElement.classList.toggle("player");
    this.playerElement.style.width = this.width + "px";
    this.playerElement.style.height = this.height + "px";
  }

  getElement() {
    return this.playerElement;
  }

  updatePlayer(direction) {

    switch (direction) {
      case "right":
        this.x += this.playerSpeed;
        this.playerElement.style.left = this.x + "px";

      case "left":
        this.x -= this.playerSpeed; 
        this.playerElement.style.left = this.x + "px";
        break;
    }


  }
}
