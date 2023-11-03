import { gameObject } from ".gameObject.js";
import { setCustomProperty } from "./updateProperties.js";

// Define a class called 'bullet' that extends the 'gameObject' class
export class bullet extends gameObject {
    // Define properties for the bullet class
    bulletElement;
    speed = 5;
    timeLife = 1500;

    // Constructor function that initializes the bullet object
    constructor(x, y, height, width) {
        // Call the constructor of the gameObject class with the given parameters
        super(x, y, height, width);
        // Call the function to set the bullet element
        this.setBulletElement();
    }

    // Function to create and set the bullet element
    setBulletElement() {
        // Create a new div element for the bullet
        this.bulletElement = document.createElement("div");
        // Add the class 'bullet' to the bullet element
        this.bulletElement.classList.add("bullet");

        // Set the custom properties for the bullet element
        this.bulletElement.style.setCustomProperty(this.bulletElement, "left", this.x + "px");
        this.bulletElement.style.setCustomProperty(this.bulletElement, "bottom", this.y + "px");
        this.bulletElement.style.setCustomProperty(this.bulletElement, "height", this.height + "px");
        this.bulletElement.style.setCustomProperty(this.bulletElement, "width", this.width + "px");

        // Set a timeout function to remove the bullet element after a specified time
        setTimeout(() => {
            this.bulletElement.remove();
        }, this.timeLife);
    }

    // Function to retrieve the bullet element
    getElement() {
        return this.bulletElement;
    }

    // This method updates the bullet's position by adjusting its vertical position.
    updateBullet() {
        this.y = this.y + this.velocity;
        setCustomProperty(this.bulletElement, "bottom", this.y + "px");
    }
}
