const playBtn = document.getElementById('play-btn');
const gameContainer = document.getElementById('game-container');
const closeGameBtn = document.getElementById('close-game');
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverScreen = document.getElementById('game-over-screen');
const restartBtn = document.getElementById('restart-btn');

// Game Config
const GRID_SIZE = 20;
const TILE_COUNT = 20; // 400x400 canvas
let CANVAS_SIZE = 400;

// Game State
let gameRunning = false;
let score = 0;
let gameSpeed = 100;
let gameLoopId;

let snake = [];
let food = { x: 0, y: 0 };
let dx = 0;
let dy = 0;
let nextDx = 0;
let nextDy = 0;

function resizeCanvas() {
    // Make it responsive for different screen sizes
    if (window.innerWidth < 400) {
        CANVAS_SIZE = 280;
    } else if (window.innerWidth < 500) {
        CANVAS_SIZE = 300;
    } else if (window.innerWidth < 768) {
        CANVAS_SIZE = 350;
    } else {
        CANVAS_SIZE = 400;
    }
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function initGame() {
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    score = 0;
    dx = 1;
    dy = 0;
    nextDx = 1;
    nextDy = 0;
    gameSpeed = 100;
    spawnFood();
    scoreElement.innerText = `SCORE: ${score}`;
    gameOverScreen.classList.add('hidden');
    gameRunning = true;

    if (gameLoopId) clearTimeout(gameLoopId);
    gameLoop();
}

function spawnFood() {
    // Random position ensuring not on snake
    let valid = false;
    while (!valid) {
        food.x = Math.floor(Math.random() * (canvas.width / GRID_SIZE));
        food.y = Math.floor(Math.random() * (canvas.height / GRID_SIZE));

        valid = true;
        for (let part of snake) {
            if (part.x === food.x && part.y === food.y) {
                valid = false;
                break;
            }
        }
    }
}

function handleInput(e) {
    if (!gameRunning) return;

    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    const W_KEY = 87;
    const A_KEY = 65;
    const S_KEY = 83;
    const D_KEY = 68;

    const keyPressed = e.keyCode;
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    // Prevent reversing directly
    if ((keyPressed === LEFT_KEY || keyPressed === A_KEY) && !goingRight) {
        nextDx = -1; nextDy = 0;
    }
    if ((keyPressed === UP_KEY || keyPressed === W_KEY) && !goingDown) {
        nextDx = 0; nextDy = -1;
    }
    if ((keyPressed === RIGHT_KEY || keyPressed === D_KEY) && !goingLeft) {
        nextDx = 1; nextDy = 0;
    }
    if ((keyPressed === DOWN_KEY || keyPressed === S_KEY) && !goingUp) {
        nextDx = 0; nextDy = 1;
    }
}

document.addEventListener('keydown', handleInput);

// Mobile Controls (Swipe)
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    e.preventDefault();
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault(); // Prevent scrolling
}, { passive: false });

canvas.addEventListener('touchend', (e) => {
    if (!gameRunning) return;
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;

    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal
        if (diffX > 0 && !goingLeft) { nextDx = 1; nextDy = 0; }
        else if (diffX < 0 && !goingRight) { nextDx = -1; nextDy = 0; }
    } else {
        // Vertical
        if (diffY > 0 && !goingUp) { nextDx = 0; nextDy = 1; }
        else if (diffY < 0 && !goingDown) { nextDx = 0; nextDy = -1; }
    }
});

function gameLoop() {
    if (!gameRunning) return;

    setTimeout(() => {
        gameLoopId = requestAnimationFrame(gameLoop);
        update();
        draw();
    }, gameSpeed);
}

function update() {
    // Update direction from buffer
    dx = nextDx;
    dy = nextDy;

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Wall Collision
    if (head.x < 0 || head.x >= canvas.width / GRID_SIZE || head.y < 0 || head.y >= canvas.height / GRID_SIZE) {
        gameOver();
        return;
    }

    // Self Collision
    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }

    snake.unshift(head);

    // Eat Food
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.innerText = `SCORE: ${score}`;
        spawnFood();
        // Increase speed slightly
        if (gameSpeed > 50) gameSpeed -= 2;
    } else {
        snake.pop();
    }
}

function draw() {
    // Clear
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Food
    ctx.fillStyle = '#ff0055'; // Glitch Red
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#ff0055";
    ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
    ctx.shadowBlur = 0;

    // Draw Snake
    ctx.fillStyle = '#00ff41'; // Matrix Green
    snake.forEach((part, index) => {
        // Head is slightly different
        if (index === 0) {
            ctx.fillStyle = '#ccffcc';
        } else {
            ctx.fillStyle = '#00ff41';
        }
        ctx.fillRect(part.x * GRID_SIZE, part.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
    });
}

function gameOver() {
    gameRunning = false;
    gameOverScreen.classList.remove('hidden');
}

function startGame() {
    gameContainer.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    initGame();
}

function stopGame() {
    gameRunning = false;
    clearTimeout(gameLoopId);
    gameContainer.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

playBtn.addEventListener('click', startGame);
closeGameBtn.addEventListener('click', stopGame);
restartBtn.addEventListener('click', initGame);

// Initial black screen
ctx.fillStyle = '#000';
ctx.fillRect(0, 0, canvas.width, canvas.height);
