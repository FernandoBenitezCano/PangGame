import { Player } from "./player.js";
import { Bullet } from "./bullet.js";
import { Ball } from "./ball.js";

let gameBoardElement = document.getElementById("gameBoard");
let startMsg = document.getElementById("startMsg");
let player;
let balls = [];
let lastShotTime = 0;
let bullets = [];
let lastCollisionTimes = new Map();

// Event handler for the key press to start the game
function keyPressed(event) {
  startMsg.classList.add("hide");
  document.removeEventListener("keydown", keyPressed);
  startGame();
}

document.addEventListener("keydown", keyPressed);

// Function to start the game
function startGame() {
  player = new Player(20, 20, 50, 30);
  gameBoardElement.appendChild(player.getElement());
  document.addEventListener("keydown", movementKey);
  document.addEventListener("keydown", shot);

  for (let i = 0; i < 2; i++) {
    // Create multiple balls with random properties
    let randomX = Math.random() * (gameBoardElement.offsetWidth - 50);
    let randomY = Math.random() * (gameBoardElement.offsetHeight - 50);
    let randomSize = Math.random() * 50 + 10;
    let randomSpeedX = (Math.random() - 0.5) * 10;
    let randomSpeedY = (Math.random() - 0.5) * 10;

    let ball = new Ball(randomX, randomY, randomSize, randomSize, gameBoardElement);
    ball.speedX = randomSpeedX;
    ball.speedY = randomSpeedY;

    gameBoardElement.appendChild(ball.getElement());
    balls.push(ball);
  }

  gameLoop();
}

// Game loop to update the game state
function gameLoop() {
  moveBalls();
  moveBullets();
  checkPlayerBallCollisions();
  requestAnimationFrame(gameLoop);
}

// Move all the balls in the game
function moveBalls() {
  balls.forEach(ball => moveBall(ball));
}

// Move a single ball
function moveBall(ball) {
  let ballElement = ball.getElement();
  let ballHitBox = ballElement.getBoundingClientRect();
  let gameBoardSize = gameBoardElement.getBoundingClientRect();

  let newTop = ballHitBox.top + ball.speedY;
  let newLeft = ballHitBox.left + ball.speedX;

  if (newTop >= gameBoardSize.top && newTop + ballHitBox.height <= gameBoardSize.bottom) {
    ballElement.style.top = newTop + "px";
  } else {
    ball.speedY = -ball.speedY;
  }

  if (newLeft >= gameBoardSize.left && newLeft + ballHitBox.width <= gameBoardSize.right) {
    ballElement.style.left = newLeft + "px";
  } else {
    ball.speedX = -ball.speedX;
  }
}

// Handle player shooting
function shot(event) {
  if (event.code === "Space" || event.key === "ArrowUp") {
    let currentTime = new Date().getTime();

    if (currentTime - lastShotTime >= 1000) {
      lastShotTime = currentTime;

      let playerHitBox = player.getElement().getBoundingClientRect();
      let bulletX = playerHitBox.left + (playerHitBox.width / 2) - (20 / 2);
      let bulletY = player.height;

      let newBullet = new Bullet(bulletX, bulletY, 20, 10);
      gameBoardElement.appendChild(newBullet.getElement());
      bullets.push(newBullet);

      let bulletMoveInterval = setInterval(() => {
        newBullet.updateBullet();
        checkCollisions(newBullet);

        if (newBullet.y < 0) {
          gameBoardElement.removeChild(newBullet.getElement());
          clearInterval(bulletMoveInterval);
          bullets.splice(bullets.indexOf(newBullet), 1);
        }
      }, 50);
    }
  }
}

// Handle player movement
function movementKey(event) {
  if (event.key === "a" || event.key === "A" || event.key === "ArrowLeft") {
    movePlayer(-player.playerSpeed);
  } else if (event.key === "d" || event.key === "D" || event.key === "ArrowRight") {
    movePlayer(player.playerSpeed);
  }
}

// Move the player
function movePlayer(deltaX) {
  let playerHitBox = player.getElement().getBoundingClientRect();
  let gameBoardSize = gameBoardElement.getBoundingClientRect();
  let newLeft = playerHitBox.left + deltaX;
  if (newLeft >= gameBoardSize.left && newLeft + playerHitBox.width <= gameBoardSize.right) {
    player.getElement().style.left = newLeft + "px";
  }
}

// Move bullets
function moveBullets() {
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].updateBullet();
  }
}

// Check collisions between bullets and balls
function checkCollisions(bullet) {
  let bulletHitBox = bullet.getElement().getBoundingClientRect();
  balls.forEach(ball => {
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
  });
}


// Check collisions between player and balls
function checkPlayerBallCollisions() {
  let currentTime = new Date().getTime();
  let playerHitBox = player.getElement().getBoundingClientRect();
  
  balls.forEach(ball => {
    let ballHitBox = ball.getElement().getBoundingClientRect();

    if (
      playerHitBox.right >= ballHitBox.left &&
      playerHitBox.left <= ballHitBox.right &&
      playerHitBox.bottom >= ballHitBox.top &&
      playerHitBox.top <= ballHitBox.bottom
    ) {
      const lastCollisionTime = lastCollisionTimes.get(ball);
      
      // Check if at least 1 second has passed since the last collision with this ball
      if (!lastCollisionTime || (currentTime - lastCollisionTime >= 1000)) {
        console.log("hit");
        lastCollisionTimes.set(ball, currentTime); // Register the time of the last collision
      }
    }
  });
}
