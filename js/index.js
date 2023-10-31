let body = document.getElementsByTagName("body")[0];
let startMsg= document.getElementById("startMsg");

function keyPressed(event) {
    startMsg.classList.toggle("hide");// startMsg it's hide
    // Delete the listener after the first key pressed
    document.removeEventListener("keydown", keyPressed);
}

document.addEventListener("keydown", keyPressed);