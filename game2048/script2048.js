const gridElement = document.getElementById("grid");
const scoreElement = document.getElementById("score");
const gameOverElement = document.getElementById("game-over");
let score = 0;
let isGameOver = false;
let board = Array(4).fill().map(() => Array(4).fill(0));

function createGrid() {
    gridElement.innerHTML = "";
    board.forEach(row => {
        row.forEach(cell => {
            const cellDiv = document.createElement("div");
            cellDiv.classList.add("cell");
            if (cell) {
                cellDiv.textContent = cell;
                cellDiv.classList.add(`tile-${cell}`);
            }
            gridElement.appendChild(cellDiv);
        });
    });
    scoreElement.textContent = score;
}

function addRandomTile() {
    let emptyCells = [];
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (board[r][c] === 0) emptyCells.push({ r, c });
        }
    }
    if (emptyCells.length > 0) {
        let { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[r][c] = Math.random() > 0.1 ? 2 : 4;
    }
}

function slide(row) {
    let newRow = row.filter(val => val);
    for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
            newRow[i] *= 2;
            score += newRow[i];
            newRow.splice(i + 1, 1);
        }
    }
    while (newRow.length < 4) newRow.push(0);
    return newRow;
}

function rotateLeft(matrix) {
    return matrix[0].map((_, i) => matrix.map(row => row[i])).reverse();
}

function move(direction) {
    if (isGameOver) return;
    let rotated = board;
    if (direction === "up") rotated = rotateLeft(board);
    else if (direction === "right") rotated = board.map(row => row.reverse());
    else if (direction === "down") rotated = rotateLeft(rotateLeft(rotateLeft(board)));

    let moved = rotated.map(row => slide(row));

    if (JSON.stringify(rotated) !== JSON.stringify(moved)) {
        if (direction === "up") board = rotateLeft(rotateLeft(rotateLeft(moved)));
        else if (direction === "right") board = moved.map(row => row.reverse());
        else if (direction === "down") board = rotateLeft(moved);
        else board = moved;

        addRandomTile();
        createGrid();
        checkWin();
        checkGameOver();
    }
}

function checkGameOver() {
    for (let row of board) {
        if (row.includes(0)) return;
    }
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if ((c < 3 && board[r][c] === board[r][c + 1]) ||
                (r < 3 && board[r][c] === board[r + 1][c])) {
                return;
            }
        }
    }
    isGameOver = true;
    gameOverElement.textContent = "Game Over!";
}

function checkWin() {
    for (let row of board) {
        if (row.includes(2048)) {
            alert("You reached 2048! You win!");
            return;
        }
    }
}

function restartGame() {
    board = Array(4).fill().map(() => Array(4).fill(0));
    score = 0;
    isGameOver = false;
    gameOverElement.textContent = "";
    addRandomTile();
    addRandomTile();
    createGrid();
}

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") move("up");
    else if (event.key === "ArrowDown") move("down");
    else if (event.key === "ArrowLeft") move("left");
    else if (event.key === "ArrowRight") move("right");
});

// Initialize game
addRandomTile();
addRandomTile();
createGrid();
