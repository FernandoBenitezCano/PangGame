import { Player } from "./player.js";
import { Bullet } from "./bullet.js";
import { Ball } from "./ball.js";

let gameBoardElement = document.getElementById("gameBoard");
let startMsg = document.getElementById("startMsg");
let player; // Declare the player outside of startGame
let lastShotTime = 0;

function keyPressed(event) {
  startMsg.classList.add("hide"); // Hide the start message
  console.log(event);

  // Delete the listener
  document.removeEventListener("keydown", keyPressed);
  startGame();
}

document.addEventListener("keydown", keyPressed);

// Complete the function startGame
function startGame() {
  player = new Player(20, 20, 50, 30);
  gameBoardElement.appendChild(player.getElement());
  document.addEventListener("keydown", movementKey);
  document.addEventListener("keydown", shot);
  let ball = new Ball(20, 20, 200, 200);
  gameBoardElement.appendChild(ball.getElement());

  setInterval(() => {
    moveBallDown(ball);
  }, ball.speed);
}

function moveBallDown(ball) {
  let ballElement = ball.getElement();
  let ballHitBox = ballElement.getBoundingClientRect();
  let gameBoardSize = gameBoardElement.getBoundingClientRect();

  // Check if the ball reaches the bottom of the game board
  if (ballHitBox.bottom < gameBoardSize.bottom) {
    let newTop = ballHitBox.top + 5; // Adjust the downward movement value as needed
    ballElement.style.top = newTop + "px";
  }
}

function shot(event) {
  if (event.code === "Space") {
    let currentTime = new Date().getTime();

    if (currentTime - lastShotTime >= 500) {

      lastShotTime = currentTime;

    // Get the player's bounding box
    let playerHitBox = player.getElement().getBoundingClientRect();

    // Calculate the initial position of the bullet centered on the player, from the top
    let bulletX = playerHitBox.left + (playerHitBox.width / 2) - (20 / 2);
    let bulletY = player.height; // Use playerHitBox.top

    let bullet = new Bullet(bulletX, bulletY, 20, 10);
    gameBoardElement.appendChild(bullet.getElement());

    // Move the bullet upwards continuously
    let bulletMoveInterval = setInterval(() => {
      bullet.updateBullet();

      // Check if the bullet is out of the game board's top boundary, then remove it and clear the interval
      if (bullet.y < 0) {
        gameBoardElement.removeChild(bullet.getElement());
        clearInterval(bulletMoveInterval);
      }
    }, 50); // Adjust the interval duration as needed
    }

  }
}

function movementKey(event) {
  if (event.key === "a" || event.key === "A" || event.key === "ArrowLeft" ) {
    movePlayer(-player.playerSpeed);
  } else if (event.key === "d" || event.key === "D" || event.key === "ArrowRight") {
    movePlayer(player.playerSpeed);
  }
}


function movePlayer(deltaX) {
  let playerHitBox = player.getElement().getBoundingClientRect();
  let gameBoardSize = gameBoardElement.getBoundingClientRect();
  let newLeft = playerHitBox.left + deltaX;
  if (newLeft >= gameBoardSize.left && newLeft + playerHitBox.width <= gameBoardSize.right) {
    player.getElement().style.left = newLeft + "px";
  }
}
