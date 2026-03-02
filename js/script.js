/** DOM */
let startBtn = document.getElementById("start-btn");
let startScreen = document.getElementById("start-screen");
let gameContainer = document.getElementById("game-container");
let ui = document.getElementById("ui");

let player = document.getElementById("avatar-player");
let hidden = document.getElementById("avatar-hidden");

let message = document.getElementById("message");
let timerDisplay = document.getElementById("timer");
let restartButton = document.getElementById("restart-btn");

/** Game variables */
let p1 = { x: 100, y: 100 };
let p2 = { x: 500, y: 300 };

let speed = 10;
let timeLeft = 60;
let timer;
let gameOver = false;
let movedYet = false;

const SIZE_W = 40;
const SIZE_H = 55;
let handleKeyDown;

/** Start */
startBtn.addEventListener("click", function () {
  startScreen.style.display = "none";
  gameContainer.style.display = "block";
  ui.style.display = "block";

  message.style.opacity = "0";
  setTimeout(function () {
    message.style.opacity = "1";
  }, 50);

  startGame();
});

function startGame() {
  gameOver = false;
  movedYet = false;

  // hide player 2 at the very start
  hidden.style.opacity = 0;

  updatePositions();
  startTimer();
}

/** Position + bounds */
function updatePositions() {
  player.style.left = p1.x + "px";
  player.style.top = p1.y + "px";

  hidden.style.left = p2.x + "px";
  hidden.style.top = p2.y + "px";
}

function clampPlayer(p) {
  p.x = Math.max(0, Math.min(window.innerWidth - SIZE_W, p.x));
  p.y = Math.max(0, Math.min(window.innerHeight - SIZE_H, p.y));
}

/** Movement */
document.addEventListener("keydown", function (e) {
  if (gameOver) return;

  movedYet = true;

  // Player 1: WASD
  if (e.key === "w" || e.key === "W") p1.y -= speed;
  if (e.key === "s" || e.key === "S") p1.y += speed;
  if (e.key === "a" || e.key === "A") p1.x -= speed;
  if (e.key === "d" || e.key === "D") p1.x += speed;

  // Player 2: arrows
  if (e.key === "ArrowUp") p2.y -= speed;
  if (e.key === "ArrowDown") p2.y += speed;
  if (e.key === "ArrowLeft") p2.x -= speed;
  if (e.key === "ArrowRight") p2.x += speed;

  clampPlayer(p1);
  clampPlayer(p2);

  updatePositions();
  checkDistance();
});

/** Distance + reveal + mood */
function checkDistance() {
  let dx = p1.x - p2.x;
  let dy = p1.y - p2.y;
  let distance = Math.sqrt(dx * dx + dy * dy);

  // reveal player 2 only after any movement
  if (!movedYet) {
    hidden.style.opacity = 0;
  } else if (distance < 250) {
    hidden.style.opacity = 1 - distance / 250;
  } else {
    hidden.style.opacity = 0;
  }

  // mood: met when close
  if (distance < 120) {
    player.classList.add("met");
    player.classList.remove("lost");

    hidden.classList.add("met");
    hidden.classList.remove("lost");
  } else {
    player.classList.add("lost");
    player.classList.remove("met");

    hidden.classList.add("lost");
    hidden.classList.remove("met");
  }

  // win
  if (distance < 60) winGame();
}

/** Timer */
function startTimer() {
  clearInterval(timer);

  timeLeft = 60;
  timerDisplay.textContent = "Time: " + timeLeft;

  timer = setInterval(function () {
    if (gameOver) return;

    timeLeft--;
    timerDisplay.textContent = "Time: " + timeLeft;

    if (timeLeft <= 0) loseGame();
  }, 1000);
}

/** End states */
function winGame() {
  gameOver = true;
  hidden.style.opacity = 1;
  message.textContent = "I see you.";
  restartButton.style.display = "inline";
  clearInterval(timer);

  document.removeEventListener("keydown", handleKeyDown);
}

function loseGame() {
  gameOver = true;
  message.textContent = "You never found me.";
  restartButton.style.display = "inline";
  clearInterval(timer);

  document.removeEventListener("keydown", handleKeyDown);
}

/** Restart */
restartButton.addEventListener("click", function () {
  location.reload();
});
