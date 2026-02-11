// elements from the DOM
let startBtn = document.getElementById("start-btn");
let startScreen = document.getElementById("start-screen");
let gameContainer = document.getElementById("game-container");

// when start button is clicked
startBtn.addEventListener("click", function () {
  // hide start screen
  startScreen.style.display = "none";

  // show game
  gameContainer.style.display = "block";
});
