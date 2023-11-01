let body = document.getElementsByTagName("body")[0];
let gameBoardElement= document.getElementById("gameBoard");
let startMsg= document.getElementById("startMsg");

function keyPressed(event) {
    startMsg.classList.toggle("hide");// startMsg it's hide
    // Delete the listener after the first key pressed
    document.removeEventListener("keydown", keyPressed);

    startGame;
}

document.addEventListener("keydown", keyPressed);


//complete the function startGame
function startGame(){ 
    //1 the ball start to fall and the character can move
    //2 If the ball hits with the character, the charater loses 1 life
    //2.1 If the character loses three lives, the defeat message will be displayed.
    // Otherwise, the victory message will be displayed.
    //3 If the ball hits with the bullet, she will die
    //4 If the ball hits the ground, walls, or ceiling, it will bounce back.
}