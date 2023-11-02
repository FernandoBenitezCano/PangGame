let body = document.getElementsByTagName("body")[0];
let gameBoardElement= document.getElementById("gameBoard");
let startMsg= document.getElementById("startMsg");
let player=document.createElement("div");

function keyPressed(event) {
    startMsg.classList.toggle("hide");// startMsg it's hide
    // Delete the listener after the first key pressed
    document.removeEventListener("keydown", keyPressed);

    startGame;
}

document.addEventListener("keydown", keyPressed);


//complete the function startGame
function startGame(){
    gameBoardElement.appendChild(player);
    player.addEventListener("keydown", movementKey);
    //1 the ball start to fall and the character can move
    //2 If the ball hits with the character, the charater loses 1 life
    //2.1 If the character loses three lives, the defeat message will be displayed.
    // Otherwise, the victory message will be displayed.
    //3 If the ball hits with the bullet, she will die
    //4 If the ball hits the ground, walls, or ceiling, it will bounce back.
}



  // Definimos una función para mover al jugador y limitar su posición dentro del cuerpo del documento
  function movementKey(event) {
    // Comprobamos si la tecla presionada es "a"
    if (event.key === "a") {
      // Llamamos a la función movePlayer con un valor negativo de velocidad para mover el jugador a la izquierda
      movePlayer(-playerSpeed);
    } else if (event.key === "d") {
      // Comprobamos si la tecla presionada es "d"
      // Llamamos a la función movePlayer con un valor positivo de velocidad para mover el jugador a la derecha
      movePlayer(playerSpeed);
    }
  }

  function movePlayer(deltaX) {
    // Obtenemos el rectángulo que describe al jugador
    let playerHitBox = player.getBoundingClientRect();
    // Obtenemos el rectángulo que describe el cuerpo del documento
    let gameBoardSize = gameBoardElement.getBoundingClientRect();
    // Calculamos la nueva posición izquierda del jugador
    let newLeft = playerHitBox.left + deltaX;
    // Verificamos si la nueva posición no excede los límites izquierdo y derecho del cuerpo del documento
    if ( newLeft >= gameBoardSize.left && newLeft + playerHitBox.width <= gameBoardSize.right) {
      // Establecemos la nueva posición izquierda del jugador en píxeles
      player.style.left = newLeft + "px";
    }
  }
  