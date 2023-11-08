// Importing necessary classes for the game
import { Player } from "./player.js";
import { Bullet } from "./bullet.js";
import { Ball } from "./ball.js";

// Declaration of global variables
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
  player = new Player(20, 20, 200, 100);
  gameBoardElement.appendChild(player.getElement());
  document.addEventListener("keydown", movementKey);
  document.addEventListener("keydown", shoot);
  createEnemies();
  backgroundMusic.volume = 0.2;
  backgroundMusic.play();
  gameLoop();
}

// Function to create the enemies (balls) in the game
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

// Function to get a random number within a range
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

// Function to remove balls and the player from the game board
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

  const minHeight = 450; // Minimum height
  const bounceDamping = 1.4; // Bounce damping factor (adjusted to reduce speed)
  const gravityAcceleration = 0.05; // Adjust the value to reduce gravity acceleration
  const maxSpeedX = 5; // Maximum speed in the horizontal direction
  const maxSpeedY = 10; // Maximum speed in the vertical direction

  let newTop = ballHitBox.top + ball.speedY;
  let newLeft = ballHitBox.left + ball.speedX;

  // Limit the maximum speed
  ball.speedX = Math.min(maxSpeedX, Math.max(-maxSpeedX, ball.speedX));
  ball.speedY = Math.min(maxSpeedY, Math.max(-maxSpeedY, ball.speedY));

  // Simulate acceleration due to gravity
  ball.speedY += gravityAcceleration;

  // Check upper and lower limits
  if (newTop + ballHitBox.height >= gameBoardSize.bottom) {
    // Calculate the vertical speed required to reach the minimum height
    const requiredSpeedY = -Math.sqrt(2 * gravityAcceleration * (minHeight - ballHitBox.height));
    // Bounce while maintaining the minimum height
    ball.speedY = requiredSpeedY * bounceDamping;

    // Make sure the ball does not fall below the new minimum height
    ballElement.style.top = (gameBoardSize.bottom - ballHitBox.height) + "px";
    
  } else if (newTop < gameBoardSize.top) {
    // Bounce at the top while maintaining the minimum height
    ball.speedY = -ball.speedY * bounceDamping;
    ballElement.style.top = gameBoardSize.top + "px";
    
  } else {
    // Move the ball in the current direction
    ballElement.style.top = newTop + "px";
  }

  // Check lateral limits
  if (newLeft + ballHitBox.width >= gameBoardSize.right) {
    // Bounce on the right edge
    ball.speedX = -ball.speedX * bounceDamping;
    ballElement.style.left = (gameBoardSize.right - ballHitBox.width) + "px";
    
  } else if (newLeft <= gameBoardSize.left) {
    // Bounce on the left edge
    ball.speedX = -ball.speedX * bounceDamping;
    ballElement.style.left = gameBoardSize.left + "px";
  
  } else {
    // Move the ball in the current direction
    ballElement.style.left = newLeft + "px";
  }
}


// Handle player shooting
function shoot(event) {
  // Check if the Space key, ArrowUp key, 'w' key, or 'W' key is pressed
  if (event.code === "Space" || event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
    let currentTime = new Date().getTime();
    player.getElement().style.backgroundImage = 'url("./img/disparo.png")';
    
    // Check if the time difference since the last shot is greater than or equal to 1000 milliseconds (1 second)
    if (currentTime - lastShotTime >= 1000) {
      lastShotTime = currentTime;
      playSound("./audio/shot.mp3");

      let playerHitBox = player.getElement().getBoundingClientRect();
      let bulletX = playerHitBox.left + 25;
      let bulletY = player.height;

      // Create a new bullet and add it to the game board
      let newBullet = new Bullet(bulletX, bulletY, 70, 25);
      gameBoardElement.appendChild(newBullet.getElement());
      bullets.push(newBullet);
    
      // Set an interval to move the bullet and check for collisions
      let bulletMoveInterval = setInterval(() => {
        newBullet.updateBullet();
        checkCollisions(newBullet);

        // Check if the bullet has moved beyond the top of the game board
        if (newBullet.y < 0) {
          gameBoardElement.removeChild(newBullet.getElement());
          clearInterval(bulletMoveInterval);
          bullets.splice(bullets.indexOf(newBullet), 1);
        }
        
      }, 50);
    }
  }
}

// Handle player movement based on key presses
function movementKey(event) {
  // Check if the 'a' key, 'A' key, or ArrowLeft key is pressed for left movement
  if (event.key === "a" || event.key === "A" || event.key === "ArrowLeft") {
    movePlayer(-player.playerSpeed);
    player.getElement().style.backgroundImage = `url("./img/izquierda.png")`;

  // Check if the 'd' key, 'D' key, or ArrowRight key is pressed for right movement
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

  // Move the player horizontally within the game board limits
  if (newLeft >= gameBoardSize.left && newLeft + playerHitBox.width <= gameBoardSize.right) {
    player.getElement().style.left = newLeft + "px";
  }
}

// Move bullets
function moveBullets() {
  // Iterate through the bullets and update their positions
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].updateBullet();
  }
}

// Check collisions between bullets and balls
function checkCollisions(bullet) {
  // Get the hit box for the bullet and game board
  let bulletHitBox = bullet.getElement().getBoundingClientRect();
  let gameBoardHitBox = gameBoardElement.getBoundingClientRect();
  let collidedEnemies = [];

  // Check for collisions between bullets and balls
  balls.forEach(ball => {
    let ballHitBox = ball.getElement().getBoundingClientRect();

    if (
      bulletHitBox.right >= ballHitBox.left &&
      bulletHitBox.left <= ballHitBox.right &&
      bulletHitBox.bottom >= ballHitBox.top &&
      bulletHitBox.top <= ballHitBox.bottom
    ) {
      // Collision with a ball
      collidedEnemies.push(ball);
    }
  });

  // Check if the bullet has collided with the ceiling
  if (bulletHitBox.top <= gameBoardHitBox.top) {
    // Remove the bullet from the game board
    gameBoardElement.removeChild(bullet.getElement());
    bullets.splice(bullets.indexOf(bullet), 1);
    return; // Exit the function to avoid further checks
  }

  for (let enemy of collidedEnemies) {
    // Remove the enemy from the game board and update game state
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

  // Update the score message with the current score
  scoreMsg.innerText = 'Score: ' + currentScore;
}

// Check collisions between player and balls
function checkPlayerBallCollisions() {
  // Get the current time
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
      
        // Check if the player still has remaining lives
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
