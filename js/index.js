import { Player } from "./player.js";
import { Bullet } from "./bullet.js";
import { Ball } from "./ball.js";

let gameBoardElement = document.getElementById("gameBoard");
let startMsg = document.getElementById("startMsg");
let container= document.getElementById("container");
let scoreMsg= document.getElementById("score");
let lifesMsg= document.getElementById("lifes");
let manualElement=document.getElementById("manual");
let  restartMsg = document.getElementById("restartMsg");

let player;
let balls = [];
let lastShotTime = 0;
let bullets = [];
let lastCollisionTimes = new Map();
let playerLifes=3;
let currentScore=0;
let enemies=3;
const SCORE_BALL=1000;

// Event handler for the key press to start the game
document.addEventListener("keydown", keyPressed);
function keyPressed(event) {
  startMsg.classList.add("hide");
  manualElement.classList.add("hide");
  document.removeEventListener("keydown", keyPressed);
  container.classList.remove("hide");
  startGame();
}

// Function to start the game
function startGame() {
  lifesMsg.innerText='Lifes: '+playerLifes;
  player = new Player(20, 20, 50, 30);
  gameBoardElement.appendChild(player.getElement());
  document.addEventListener("keydown", movementKey);
  document.addEventListener("keydown", shoot);
  createEnemies(); 


  gameLoop();
}

function createEnemies(){
  for (let i = 0; i < enemies; i++) {
    // Create multiple balls with random properties
    let randomX = Math.random() * (gameBoardElement.offsetWidth - 50);
    let randomY = Math.random() * (gameBoardElement.offsetHeight - 50);
    let randomSize = Math.floor(Math.random() * (80 - 50 + 1)) + 50;
    let randomSpeedX = (Math.random() - 0.5) * 10;
    let randomSpeedY = (Math.random() - 0.5) * 10;

    let ball = new Ball(randomX, randomY, randomSize, randomSize, gameBoardElement);
    ball.speedX = randomSpeedX;
    ball.speedY = randomSpeedY;

    gameBoardElement.appendChild(ball.getElement());
    balls.push(ball);
  }
}

// Game loop to update the game state
function gameLoop() {
  moveBalls();
  moveBullets();
  checkPlayerBallCollisions();
  showMessage();

  if (enemies > 0) {
    requestAnimationFrame(gameLoop);
  }
}

//show defeat or error
function showMessage() {
  if (enemies == 0) {
    startMsg.innerText = "VICTORY!!!";
    startMsg.classList.remove("hide");
    restartMsg.classList.remove("hide");
    removeBallsAndPlayer();
    document.removeEventListener("keydown", shoot);
  }

  if (playerLifes <= 0) {
    startMsg.innerText = "DEFEAT!!!";
    startMsg.classList.remove("hide");
    restartMsg.classList.remove("hide");
    removeBallsAndPlayer();
    document.removeEventListener("keydown", shoot);
  }
}

function removeBallsAndPlayer() {
  // Delete all the ball
  for (let i = 0; i < balls.length; i++) {
    let ballElement = balls[i].getElement();
    if (ballElement.parentNode) {
      ballElement.parentNode.removeChild(ballElement);
    }
  }
  balls = [];

  // Elimina el elemento player
  gameBoardElement.removeChild(player.getElement());
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
function shoot(event) {
  if (event.code === "Space" || event.key === "ArrowUp" ||  event.key === "w" || event.key === "W") {
    let currentTime = new Date().getTime();

    if (currentTime - lastShotTime >= 1000) {
      lastShotTime = currentTime;

      let playerHitBox = player.getElement().getBoundingClientRect();
      let bulletX = playerHitBox.left + (playerHitBox.width / 2) - (20 / 2);
      let bulletY = player.height;

      let newBullet = new Bullet(bulletX, bulletY, 70, 25);
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
  let gameBoardHitBox = gameBoardElement.getBoundingClientRect();
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
      enemies--;
      currentScore+=SCORE_BALL;
      scoreMsg.innerText='Score: '+ currentScore;
    }
  });

  if (bulletHitBox.top <= gameBoardHitBox.top) {
    gameBoardElement.removeChild(bullet.getElement());
  }
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
        lastCollisionTimes.set(ball, currentTime); // Register the time of the last collision
        playerLifes--;

        if (playerLifes >= 0) {
          lifesMsg.innerText = 'Lifes: ' + playerLifes;
          resetPlayerPosition(); // Restablece la posición del jugador al centro pegado al suelo
        }
      }
    }
  });
}

function resetPlayerPosition() {
  const newLeft = 50

  player.getElement().style.left = newLeft + '%';
}
