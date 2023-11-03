// Importa la clase GameObject desde gameObject.js
import { GameObject } from "./gameObject.js";
import { setCustomProperty } from "./updateProperties.js";
// Define la clase player que extiende GameObject

export class Player extends GameObject {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.setElement();
  }

  setElement() {
    
    this.element = document.createElement("div");      
    this.element.classList.toggle("player");
    this.element.style.width = this.width + "px";
    this.element.style.height = this.height + "px";
    document.body.appendChild(this.element);
  }

}
