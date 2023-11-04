import { Player } from "./player.js";
import { Bullet } from "./bullet.js";
import { Ball } from "./ball.js";
let gameBoardElement = document.getElementById("gameBoard");
let startMsg = document.getElementById("startMsg");
let player = document.createElement("div");
player.classList.add("player");
player.style.width=50+"px";
player.style.height=50+"px";
let playerSpeed = 15; // player velocity

function keyPressed(event) {
  startMsg.classList.add("hide"); // Oculta el mensaje de inicio
  console.log(event);
  //Add the listener
  document.addEventListener("keydown", movementKey);
  // Delete the listener
  document.removeEventListener("keydown", keyPressed);
  startGame();
}

document.addEventListener("keydown", keyPressed);

// Complete the function startGame
function startGame() {
  gameBoardElement.appendChild(player);
  let bullet= new Bullet(20,20,20,10);
  let ball= new Ball(20,20,200,200);
  gameBoardElement.appendChild(ball.getElement());
  gameBoardElement.appendChild(bullet.getElement());
}

function movementKey(event) {
  if (event.key === "a" || event.key === "A" || event.key === "ArrowLeft" ) {
    movePlayer(-playerSpeed);
  } else if (event.key === "d" || event.key === "D" || event.key === "ArrowRight") {
    movePlayer(playerSpeed);
  }
}

function movePlayer(deltaX) {
  let playerHitBox = player.getBoundingClientRect();
  let gameBoardSize = gameBoardElement.getBoundingClientRect();
  let newLeft = playerHitBox.left + deltaX;
  if (newLeft >= gameBoardSize.left && newLeft + playerHitBox.width <= gameBoardSize.right) {
    player.style.left = newLeft + "px";
  }
}
