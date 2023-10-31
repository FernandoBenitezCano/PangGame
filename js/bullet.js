import {gameObject} from ".gameObject.js";

export class bullet extends gameObject {
    bulletElement;
    timeLife = 1500;


    constructor(x, y, height, width) {
        super(x, y, height, width)
        this.setElement();
    }

    setBulletElement(){
        this.bulletElement = document.createElement("div");
        this.bulletElement.classList.add("bullet");

        this.bulletElement.style.setProperty("left" + this.x + "px");
        this.bulletElement.style.setProperty("bottom" + this.y + "px");

        setTimeout(() => {
            this.bulletElement.remove();
        }, this.timeLife);
    }


}