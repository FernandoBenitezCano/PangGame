import { Player } from "./player.js";
import { Bullet } from "./bullet.js";
import { Ball } from "./ball.js";

let gameBoardElement = document.getElementById("gameBoard");
let startMsg = document.getElementById("startMsg");
let container = document.getElementById("container");
let scoreMsg = document.getElementById("score");
let lifesMsg = document.getElementById("lifes");
let manualElement = document.getElementById("manual");
let restartMsg = document.getElementById("restartMsg");
let gameSound = document.getElementById("gameSound");
let backgroundMusic = document.getElementById("backgroundMusic");

let player;
let balls = [];
let lastShotTime = 0;
let bullets = [];
let lastCollisionTimes = new Map();
let playerLifes = 5;
let currentScore = 0;
let enemies = 10;
const SCORE_BALL = 1000;

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
  lifesMsg.innerText = 'Lifes: ' + playerLifes;
  player = new Player(20, 20, 150, 100);
  gameBoardElement.appendChild(player.getElement());
  document.addEventListener("keydown", movementKey);
  document.addEventListener("keydown", shoot);
  createEnemies();
  backgroundMusic.volume = 0.2;
  backgroundMusic.play();
  gameLoop();
}

function createEnemies() {
  for (let i = 0; i < enemies; i++) {
    // Create multiple balls with random properties
    let randomX = Math.random() * (gameBoardElement.offsetWidth - 50);
    let randomY = Math.random() * (gameBoardElement.offsetHeight - 50);
    let minSize=50;
    let maxSize=100;
    let randomSize = getRandomNumber(minSize, maxSize);

    // Generate a random direction (right or left)
    let randomDirection = Math.random() < 0.5 ? 1 : -1;

    // Adjust the horizontal speed (X) to slightly dodge the center
    let randomSpeedX = (Math.random() - 0.5) * 10 + randomDirection * 2;

    let randomSpeedY = (Math.random() - 0.5) * 10;

    let ball = new Ball(randomX, randomY, randomSize, randomSize, gameBoardElement);
    ball.speedX = randomSpeedX;
    ball.speedY = randomSpeedY;

    gameBoardElement.appendChild(ball.getElement());
    balls.push(ball);
  }
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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

// Show defeat or victory message
function showMessage() {
  if (enemies == 0) {
    startMsg.innerText = "VICTORY!!!";
    startMsg.classList.remove("hide");
    restartMsg.classList.remove("hide");
    removeBallsAndPlayer();
    document.removeEventListener("keydown", shoot);
    backgroundMusic.pause();
    playSound("./audio/victory.mp3");
  }

  if (playerLifes <= 0) {
    startMsg.innerText = "DEFEAT!!!";
    startMsg.classList.remove("hide");
    restartMsg.classList.remove("hide");
    removeBallsAndPlayer();
    document.removeEventListener("keydown", shoot);
    backgroundMusic.pause();
    playSound("./audio/defeat.mp3");  
  }
}

function removeBallsAndPlayer() {
  // Delete all the balls
  for (let i = 0; i < balls.length; i++) {
    let ballElement = balls[i].getElement();
    if (ballElement.parentNode) {
      ballElement.parentNode.removeChild(ballElement);
    }
  }
  balls = [];

  // Remove the player element
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

  const minHeight = 450; // Altura mínima
  const bounceDamping = 1.4; // Factor de amortiguación del rebote (ajustado para reducir la velocidad)
  const gravityAcceleration = 0.05; // Ajusta el valor para reducir la aceleración debida a la gravedad
  const maxSpeedX = 5; // Velocidad máxima en dirección horizontal
  const maxSpeedY = 10; // Velocidad máxima en dirección vertical

  let newTop = ballHitBox.top + ball.speedY;
  let newLeft = ballHitBox.left + ball.speedX;

  // Limitar la velocidad máxima
  ball.speedX = Math.min(maxSpeedX, Math.max(-maxSpeedX, ball.speedX));
  ball.speedY = Math.min(maxSpeedY, Math.max(-maxSpeedY, ball.speedY));

  // Simular la aceleración debida a la gravedad
  ball.speedY += gravityAcceleration;

  // Comprobar los límites superior e inferior
  if (newTop + ballHitBox.height >= gameBoardSize.bottom) {
    // Calcular la velocidad vertical requerida para alcanzar la altura mínima
    const requiredSpeedY = -Math.sqrt(2 * gravityAcceleration * (minHeight - ballHitBox.height));
    // Rebotar manteniendo la altura mínima
    ball.speedY = requiredSpeedY * bounceDamping;

    // Asegurarse de que la bola no caiga por debajo de la nueva altura mínima
    ballElement.style.top = (gameBoardSize.bottom - ballHitBox.height) + "px";
    
  } else if (newTop < gameBoardSize.top) {
    // Rebotar en la parte superior manteniendo la altura mínima
    ball.speedY = -ball.speedY * bounceDamping;
    ballElement.style.top = gameBoardSize.top + "px";
    
  } else {
    // Mover la bola en la dirección actual
    ballElement.style.top = newTop + "px";
  }

  // Comprobar los límites laterales
  if (newLeft + ballHitBox.width >= gameBoardSize.right) {
    // Rebotar en el borde derecho
    ball.speedX = -ball.speedX * bounceDamping;
    ballElement.style.left = (gameBoardSize.right - ballHitBox.width) + "px";
    
  } else if (newLeft <= gameBoardSize.left) {
    // Rebotar en el borde izquierdo
    ball.speedX = -ball.speedX * bounceDamping;
    ballElement.style.left = gameBoardSize.left + "px";
   
  } else {
    // Mover la bola en la dirección actual
    ballElement.style.left = newLeft + "px";
  }
}


// Handle player shooting
function shoot(event) {
  if (event.code === "Space" || event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
    let currentTime = new Date().getTime();
    player.getElement().style.backgroundImage = 'url("./img/disparo.png")';
     // Cambia el alto y ancho a tus valores deseados

    if (currentTime - lastShotTime >= 1000) {
      lastShotTime = currentTime;
      playSound("./audio/shot.mp3");

      let playerHitBox = player.getElement().getBoundingClientRect();
      let bulletX = playerHitBox.left + 25;
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
    player.getElement().style.backgroundImage = `url("./img/izquierda.png")`;
  } else if (event.key === "d" || event.key === "D" || event.key === "ArrowRight") {
    movePlayer(player.playerSpeed);
    player.getElement().style.backgroundImage = `url("./img/derecha.png")`;
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
  let collidedEnemies = [];

  balls.forEach(ball => {
    let ballHitBox = ball.getElement().getBoundingClientRect();

    if (
      bulletHitBox.right >= ballHitBox.left &&
      bulletHitBox.left <= ballHitBox.right &&
      bulletHitBox.bottom >= ballHitBox.top &&
      bulletHitBox.top <= ballHitBox.bottom
    ) {
      // Colisión con una bola
      collidedEnemies.push(ball);
    }
  });

  // Comprueba si la bala ha colisionado con el techo
  if (bulletHitBox.top <= gameBoardHitBox.top) {
    // Elimina la bala del tablero
    gameBoardElement.removeChild(bullet.getElement());
    bullets.splice(bullets.indexOf(bullet), 1);
    return; // Sale de la función para evitar más comprobaciones
  }

  for (let enemy of collidedEnemies) {
    gameBoardElement.removeChild(enemy.getElement());
    enemies--;
    currentScore += SCORE_BALL;
    playSound("./audio/enemyDown.mp3");
  }

  // Remove the bullet after all collisions have been checked
  if (collidedEnemies.length > 0) {
    gameBoardElement.removeChild(bullet.getElement());
    bullets.splice(bullets.indexOf(bullet), 1);
  }

  // Update the score
  scoreMsg.innerText = 'Score: ' + currentScore;
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
        playSound("./audio/playerhurt.mp3");
       

        if (playerLifes >= 0) {
          lifesMsg.innerText = 'Lifes: ' + playerLifes;
          resetPlayerPosition(); // Reset the player's position to the center stuck to the ground
        }
      }
    }
  });
}

function resetPlayerPosition() {
  const newLeft = 50;
  player.getElement().style.left = newLeft + '%';
}

function playSound(soundSource) {

  gameSound.src = soundSource;
  gameSound.play();
}
