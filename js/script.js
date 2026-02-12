/**Elements from the DOM*/
let startBtn = document.getElementById("start-btn");
let startScreen = document.getElementById("start-screen");
let gameContainer = document.getElementById("game-container");
let ui = document.getElementById("ui");

/**Game elements*/
let player = document.getElementById("avatar-player");
let hidden = document.getElementById("avatar-hidden");
let message = document.getElementById("message");
let timerDisplay = document.getElementById("timer");
let restartButton = document.getElementById("restart-button");

/**Game variables*/
let player1 = {
  x: 100,
  y: 100
};

let player2 = {
  x: 500,
  y: 300
};
let speed = 10;
let timeLeft = 60;
let timer;
let gameOver = false;

// when start button is clicked
startBtn.addEventListener("click", function () {
  // hide start screen
  startScreen.style.display = "none";

  // show game
  gameContainer.style.display = "block";

  //ui display
  ui.style.display = "block";

  //start the game 
  startGame();


});

/**Start game function */

function startGame() {
  updatePositions();
  startTimer();
}

//positions setup
function updatePositions() {

}

