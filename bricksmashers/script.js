const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let ball = { x: 240, y: 160, dx: 6, dy: -6, r: 12 };
let paddle = { x: 360, w: 100, h: 12 };
let bricks = [];
let score = 0, running = false;

const rows = 4, cols = 10;
for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    bricks.push({
      x: 80 * c + 20,
      y: 30 * r + 30,
      w: 70,
      h: 15,
      visible: true
    });
  }
}

document.addEventListener('mousemove', e => {
  let rect = canvas.getBoundingClientRect();
  paddle.x = e.clientX - rect.left - paddle.w / 2;
});

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fillStyle = '#192A51';
  ctx.shadowColor = '#AAB7FF';
  ctx.shadowBlur = 20;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#C0C0C0';
  ctx.stroke();
  ctx.closePath();

  // Reset shadow after drawing
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';
}

function drawPaddle() {
  ctx.fillStyle = '#AAA1C8';
  ctx.fillRect(paddle.x, canvas.height - 20, paddle.w, paddle.h);
}

function drawBricks() {
  bricks.forEach(b => {
    if (b.visible) {
      ctx.fillStyle = '#967AA1';
      ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.strokeStyle = '#192A51';
      ctx.strokeRect(b.x, b.y, b.w, b.h);
    }
  });
}

function drawScore() {
  document.getElementById('score').textContent = score;
}

function collision() {
  bricks.forEach(b => {
    if (b.visible &&
        ball.x > b.x && ball.x < b.x + b.w &&
        ball.y - ball.r < b.y + b.h && ball.y + ball.r > b.y) {
      ball.dy *= -1;
      b.visible = false;
      score++;
    }
  });

  if (ball.x < ball.r || ball.x > canvas.width - ball.r) ball.dx *= -1;
  if (ball.y < ball.r) ball.dy *= -1;
  if (ball.y + ball.r > canvas.height) running = false;

  if (
    ball.y + ball.r > canvas.height - 20 &&
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.w
  ) {
    ball.dy *= -1;
  }
}

function update() {
  if (!running) return;

  // Translucent background for trail effect
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawBall();
  drawPaddle();
  drawBricks();
  drawScore();

  ball.x += ball.dx;
  ball.y += ball.dy;

  collision();
  requestAnimationFrame(update);
}

function startGame() {
  running = true;
  ball = { x: 240, y: 160, dx: 3, dy: -3, r: 12 };
  paddle.x = 360;
  bricks.forEach(b => b.visible = true);
  score = 0;
  update();
}