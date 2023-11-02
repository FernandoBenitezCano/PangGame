let gameBoardElement = document.getElementById("gameBoard");
let startMsg = document.getElementById("startMsg");
let player = document.createElement("div");
player.classList.add("player"); // Agrega la clase "player" para aplicar estilos

let playerSpeed = 15; // Define la velocidad de movimiento del jugador

function keyPressed(event) {
  startMsg.classList.add("hide"); // Oculta el mensaje de inicio
  // Agrega el evento de escucha de teclas al documento global para controlar el movimiento del jugador
  document.addEventListener("keydown", movementKey);
  // Elimina el listener para que no se ejecute más veces
  document.removeEventListener("keydown", keyPressed);
  startGame();
}

document.addEventListener("keydown", keyPressed);

// Completa la función startGame
function startGame() {
  gameBoardElement.appendChild(player);
  // Otros elementos y lógica del juego
}

function movementKey(event) {
  // Comprueba si la tecla presionada es "a" o "d"
  if (event.key === "a") {
    movePlayer(-playerSpeed);
  } else if (event.key === "d") {
    movePlayer(playerSpeed);
  }
}

function movePlayer(deltaX) {
  // Obtiene el rectángulo que describe al jugador
  let playerHitBox = player.getBoundingClientRect();
  // Obtiene el rectángulo que describe el tablero del juego
  let gameBoardSize = gameBoardElement.getBoundingClientRect();
  // Calcula la nueva posición izquierda del jugador
  let newLeft = playerHitBox.left + deltaX;
  // Verifica si la nueva posición no excede los límites izquierdo y derecho del tablero del juego
  if (newLeft >= gameBoardSize.left && newLeft + playerHitBox.width <= gameBoardSize.right) {
    // Establece la nueva posición izquierda del jugador en píxeles
    player.style.left = newLeft + "px";
  }
}
