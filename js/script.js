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
let restartButton = document.getElementById("restart-btn");

/**Game variables*/
//Players
let p1 = {
  x: 100,
  y: 100,
};

let p2 = {
  x: 500,
  y: 300,
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
  //player1
  player.style.left = p1.x + "px";
  player.style.top = p1.y + "px";
  //player2
  hidden.style.left = p2.x + "px";
  hidden.style.top = p2.y + "px";
}

/**Movement controls */
document.addEventListener("keydown", function (e) {
  if (gameOver) return;

  //Player 1 W A S D
  if (e.key === "w" || e.key === "W") p1.y -= speed;
  if (e.key === "s" || e.key === "S") p1.y += speed;
  if (e.key === "a" || e.key === "A") p1.x -= speed;
  if (e.key === "d" || e.key === "D") p1.x += speed;

  //Player 2 arrows
  if (e.key === "ArrowUp") p2.y -= speed;
  if (e.key === "ArrowDown") p2.y += speed;
  if (e.key === "ArrowLeft") p2.x -= speed;
  if (e.key === "ArrowRight") p2.x += speed;

  updatePositions();
  checkDistance();
});
