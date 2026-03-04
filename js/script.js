/** DOM */
let startBtn = document.getElementById("start-btn");
let startScreen = document.getElementById("start-screen");
let gameContainer = document.getElementById("game-container");
let ui = document.getElementById("ui");

let player = document.getElementById("avatar-player"); // Player 1
let hidden = document.getElementById("avatar-hidden"); // Player 2

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

const SIZE_W = 380;
const SIZE_H = 130;

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

/** Prevent overlap (so one angel doesn’t sit on top of the other) */
function separateIfOverlapping() {
  let overlapX = p1.x < p2.x + SIZE_W && p1.x + SIZE_W > p2.x;
  let overlapY = p1.y < p2.y + SIZE_H && p1.y + SIZE_H > p2.y;

  if (!(overlapX && overlapY)) return;

  // push them apart based on their centers
  let c1x = p1.x + SIZE_W / 2;
  let c1y = p1.y + SIZE_H / 2;
  let c2x = p2.x + SIZE_W / 2;
  let c2y = p2.y + SIZE_H / 2;

  let dx = c1x - c2x;
  let dy = c1y - c2y;

  // if perfectly stacked, pick a direction
  if (dx === 0 && dy === 0) dx = 1;

  // small push amount (feels less “bouncy”)
  let push = 4;

  if (Math.abs(dx) > Math.abs(dy)) {
    // separate horizontally
    if (dx > 0) {
      p1.x += push;
      p2.x -= push;
    } else {
      p1.x -= push;
      p2.x += push;
    }
  } else {
    // separate vertically
    if (dy > 0) {
      p1.y += push;
      p2.y -= push;
    } else {
      p1.y -= push;
      p2.y += push;
    }
  }

  clampPlayer(p1);
  clampPlayer(p2);
}

/** Distance + reveal + mood */
function checkDistance() {
  // use center-to-center distance (better for large sprites)
  let p1cx = p1.x + SIZE_W / 2;
  let p1cy = p1.y + SIZE_H / 2;
  let p2cx = p2.x + SIZE_W / 2;
  let p2cy = p2.y + SIZE_H / 2;

  let dx = p1cx - p2cx;
  let dy = p1cy - p2cy;
  let distance = Math.sqrt(dx * dx + dy * dy);

  // reveal player 2 only after any movement
  if (!movedYet) {
    hidden.style.opacity = 0;
  } else if (distance < 300) {
    hidden.style.opacity = 1 - distance / 300;
  } else {
    hidden.style.opacity = 0;
  }

  // mood: met when close
  if (distance < 160) {
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

  // win (tweak if needed)
  if (distance < 95) winGame();
}

/** Movement (stored in a variable so removeEventListener actually works) */
handleKeyDown = function (e) {
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

  // stop overlap
  separateIfOverlapping();

  updatePositions();
  checkDistance();
};

document.addEventListener("keydown", handleKeyDown);

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

  // reveal the restart button using the same class mechanism as loseGame
  restartButton.classList.add("show");

  clearInterval(timer);
  document.removeEventListener("keydown", handleKeyDown);
}

function loseGame() {
  gameOver = true;
  message.textContent = "You never found me.";
  restartButton.classList.add("show");
  clearInterval(timer);

  document.removeEventListener("keydown", handleKeyDown);
}

/** Restart */
restartButton.addEventListener("click", function () {
  location.reload();
});
