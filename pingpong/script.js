const paddle1 = document.getElementById('paddle1');
const paddle2 = document.getElementById('paddle2');
const ball = document.getElementById('ball');
const player1Score = document.getElementById('player1Score');
const player2Score = document.getElementById('player2Score');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');

let paddleSpeed = 10;
let ballSpeedX = 4;
let ballSpeedY = 4;
let animationId;
let isGameRunning = false;

let ballX = 345;
let ballY = 200;

let p1Score = 0;
let p2Score = 0;

// Paddle movement flags
let paddle1Direction = 0;
let paddle2Direction = 0;

// Keyboard input
document.addEventListener('keydown', (e) => {
  if (e.key === 'w') paddle1Direction = -1;
  if (e.key === 's') paddle1Direction = 1;
  if (e.key === 'ArrowUp') paddle2Direction = -1;
  if (e.key === 'ArrowDown') paddle2Direction = 1;
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'w' || e.key === 's') paddle1Direction = 0;
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') paddle2Direction = 0;
});

// Start and Reset
startBtn.addEventListener('click', () => {
  if (!isGameRunning) {
    isGameRunning = true;
    animationId = requestAnimationFrame(updateGame);
  }
});

resetBtn.addEventListener('click', resetGame);

// Game loop
function updateGame() {
  moveBall();
  movePaddlesSmooth();
  if (isGameRunning) {
    animationId = requestAnimationFrame(updateGame);
  }
}

// Smooth paddle motion
function movePaddlesSmooth() {
  const p1Top = parseInt(window.getComputedStyle(paddle1).getPropertyValue('top'));
  const p2Top = parseInt(window.getComputedStyle(paddle2).getPropertyValue('top'));

  if (paddle1Direction === -1 && p1Top > 0) {
    paddle1.style.top = `${p1Top - paddleSpeed}px`;
  } else if (paddle1Direction === 1 && p1Top < 280) {
    paddle1.style.top = `${p1Top + paddleSpeed}px`;
  }

  if (paddle2Direction === -1 && p2Top > 0) {
    paddle2.style.top = `${p2Top - paddleSpeed}px`;
  } else if (paddle2Direction === 1 && p2Top < 280) {
    paddle2.style.top = `${p2Top + paddleSpeed}px`;
  }
}

// Ball movement and collision
function moveBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  ball.style.left = `${ballX}px`;
  ball.style.top = `${ballY}px`;

  const paddle1Top = parseInt(window.getComputedStyle(paddle1).getPropertyValue('top'));
  const paddle2Top = parseInt(window.getComputedStyle(paddle2).getPropertyValue('top'));

  // Bounce on top/bottom
  if (ballY <= 0 || ballY + 30 >= 400) {
    ballSpeedY *= -1;
  }

  // Paddle 1 (left)
  if (
    ballX <= 18 &&
    ballY + 15 >= paddle1Top &&
    ballY + 15 <= paddle1Top + 120
  ) {
    ballSpeedX *= -1;
    ballX = 18;
  }

  // Paddle 2 (right)
  if (
    ballX + 30 >= 782 &&
    ballY + 15 >= paddle2Top &&
    ballY + 15 <= paddle2Top + 120
  ) {
    ballSpeedX *= -1;
    ballX = 752;
  }

  // Scoring
  if (ballX < 0) {
    p2Score++;
    updateScore();
    resetBall();
  } else if (ballX > 800) {
    p1Score++;
    updateScore();
    resetBall();
  }
}

function updateScore() {
  player1Score.textContent = p1Score;
  player2Score.textContent = p2Score;
}

function resetBall() {
  ballX = 345;
  ballY = 200;
  ballSpeedX = -ballSpeedX;
  ball.style.left = `${ballX}px`;
  ball.style.top = `${ballY}px`;
}

function resetGame() {
  cancelAnimationFrame(animationId);
  isGameRunning = false;
  p1Score = 0;
  p2Score = 0;
  updateScore();
  resetBall();
}

