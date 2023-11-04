import { Player } from "./player.js";
import { Bullet } from "./bullet.js";
import { Ball } from "./ball.js";

let gameBoardElement = document.getElementById("gameBoard");
let startMsg = document.getElementById("startMsg");
let player; // Declarar el jugador fuera de startGame

function keyPressed(event) {
  startMsg.classList.add("hide"); // Oculta el mensaje de inicio
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
}

function shot(event) {
  if (event.code === "Space") {
    // Obtiene el cuadro delimitador del jugador
    let playerHitBox = player.getElement().getBoundingClientRect();

    // Calcula la posición inicial de la bala centrada en el jugador, desde arriba
    let bulletX = playerHitBox.left + (playerHitBox.width / 2) - (20 / 2);
    let bulletY = player.height; // Utiliza playerHitBox.top

    let bullet = new Bullet(bulletX, bulletY, 20, 10);
    gameBoardElement.appendChild(bullet.getElement());
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
