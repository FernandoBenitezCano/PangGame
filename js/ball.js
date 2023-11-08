import { GameObject } from "./gameObject.js";
import { setCustomProperty } from "./updateProperties.js";

// This class represents a Ball that extends the properties of a GameObject
export class Ball extends GameObject {
  speedX = 3;
  speedY = 3;

  // Array of image paths for the ball
  imagenes = [
    './img/enemyBlue.png',
    './img/enemyRed.png',
    './img/enemyPurple.png',
    './img/enemyGreen.png',
  ];

  // Constructor for the Ball class, calling the constructor of the GameObject class
  constructor(x, y, height, width, gameBoardElement) {
    super(x, y, height, width);
    this.gameBoardElement = gameBoardElement;
    this.setElement();
  }

  // Method to set the element for the ball
  setElement() {
    // Creating a div element for the ball
    this.ballElement = document.createElement("div");
    this.ballElement.classList.add("ball");
    // Setting custom properties for the ball element
    setCustomProperty(this.ballElement, "height", this.height + "px");
    setCustomProperty(this.ballElement, "width", this.width + "px");

    // Generating a random index to select an image for the ball
    const randomImageIndex = Math.floor(Math.random() * this.imagenes.length);
    const randomImage = this.imagenes[randomImageIndex];

    // Setting the background image for the ball element
    this.ballElement.style.backgroundImage = `url(${randomImage})`;
  }

  // Method to get the ball element
  getElement() {
    return this.ballElement;
  }
}