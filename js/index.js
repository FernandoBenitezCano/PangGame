import { Player } from "./player.js";
import { Bullet } from "./bullet.js";
import { Ball } from "./ball.js";

let gameBoardElement = document.getElementById("gameBoard");
let startMsg = document.getElementById("startMsg");
let player;
let ball;
let lastShotTime = 0;

let bullets = []; // Usar un array para almacenar múltiples balas

function keyPressed(event) {
  startMsg.classList.add("hide");
  console.log(event);

  document.removeEventListener("keydown", keyPressed);
  startGame();
}

document.addEventListener("keydown", keyPressed);

function startGame() {
  player = new Player(20, 20, 50, 30);
  gameBoardElement.appendChild(player.getElement());
  document.addEventListener("keydown", movementKey);
  document.addEventListener("keydown", shot);
  ball = new Ball(20, 20, 200, 200);
  gameBoardElement.appendChild(ball.getElement());

  gameLoop();
}

function gameLoop() {
  moveBallDown(ball);
  moveBullets(); // Llamar a la función para mover las balas

  requestAnimationFrame(gameLoop);
}

function moveBallDown(ball) {
  let ballElement = ball.getElement();
  let ballHitBox = ballElement.getBoundingClientRect();
  let gameBoardSize = gameBoardElement.getBoundingClientRect();

  if (ballHitBox.bottom < gameBoardSize.bottom) {
    let newTop = ballHitBox.top + 5;
    ballElement.style.top = newTop + "px";
  }
}

function shot(event) {
  if (event.code === "Space") {
    let currentTime = new Date().getTime();

    if (currentTime - lastShotTime >= 1000) {
      lastShotTime = currentTime;

      let playerHitBox = player.getElement().getBoundingClientRect();
      let bulletX = playerHitBox.left + (playerHitBox.width / 2) - (20 / 2);
      let bulletY = player.height;

      // Create a new bullet and add it to the array
      let newBullet = new Bullet(bulletX, bulletY, 20, 10);
      gameBoardElement.appendChild(newBullet.getElement());
      bullets.push(newBullet);

      // Start the continuous bullet movement interval
      let bulletMoveInterval = setInterval(() => {
        newBullet.updateBullet();
        checkCollisions(newBullet); // Pasar la bala a la función de colisión

        if (newBullet.y < 0) {
          gameBoardElement.removeChild(newBullet.getElement());
          clearInterval(bulletMoveInterval);
          // Remove the bullet from the array
          bullets.splice(bullets.indexOf(newBullet), 1);
        }
      }, 50);
    }
  }
}

function movementKey(event) {
  if (event.key === "a" || event.key === "A" || event.key === "ArrowLeft") {
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

function moveBullets() {
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].updateBullet();
  }
}

function checkCollisions(bullet) {
  let bulletHitBox = bullet.getElement().getBoundingClientRect();
  let ballHitBox = ball.getElement().getBoundingClientRect();

  if (
    bulletHitBox.right >= ballHitBox.left &&
    bulletHitBox.left <= ballHitBox.right &&
    bulletHitBox.bottom >= ballHitBox.top &&
    bulletHitBox.top <= ballHitBox.bottom
  ) {
    gameBoardElement.removeChild(ball.getElement());
    gameBoardElement.removeChild(bullet.getElement());
  }
}