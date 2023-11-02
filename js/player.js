
const player = document.getElementById("player");
      const playerSpeed = 15;

      // Event listener para detectar las teclas 'A' y 'D'
      document.addEventListener("keydown", function (event) {
        if (event.key === "a") {
          movePlayer(-playerSpeed);
        } else if (event.key === "d") {
          movePlayer(playerSpeed);
        }
      });

      // Función para mover el jugador y limitar su posición dentro del cuerpo
      function movePlayer(deltaX) {
        const playerRect = player.getBoundingClientRect();
        const bodyRect = document.body.getBoundingClientRect();
        const newLeft = playerRect.left + deltaX;

        if (
          newLeft >= bodyRect.left &&
          newLeft + playerRect.width <= bodyRect.right
        ) {
          player.style.left = newLeft + "px";
        }
      }