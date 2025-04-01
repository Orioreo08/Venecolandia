const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const gameOverSound = document.getElementById("gameOverSound");
const eatSound = document.getElementById("eatSound");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let setIntervalid;
let score = 0;
let highScore = localStorage.getItem("high-score") || 0;
let speed = 130;
let obstacles = [];
let obstaclesStarted = false;
let obstacleInterval;
let currentSpeedLevel = 0;

highScoreElement.innerHTML = `High Score: ${highScore}`;

const changFoodPosition = () => {
    do {
        foodX = Math.floor(Math.random() * 30) + 1;
        foodY = Math.floor(Math.random() * 30) + 1;
    } while (!isPositionSafe(foodX, foodY));
};

const isPositionSafe = (x, y) => {
    for (let i = 0; i < snakeBody.length; i++) {
        if (Math.abs(snakeBody[i][0] - x) <= 1 && Math.abs(snakeBody[i][1] - y) <= 1) {
            return false;
        }
    }
    return true;
};

const generateFallingObstacle = () => {
    const length = Math.floor(Math.random() * 5) + 2;
    const obstacleX = Math.floor(Math.random() * (30 - length)) + 1;
    obstacles.push({ x: obstacleX, y: 0, length: length });
};

const handleGameOver = () => {
    clearInterval(setIntervalid);
    clearInterval(obstacleInterval);
    gameOverSound.currentTime = 0;
    gameOverSound.play();
    document.getElementById("finalScore").innerText = score;
    document.getElementById("gameOverModal").style.display = "block";
};

const changeDirection = (e) => {
    if (e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = +1;
    } else if (e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX != -1) {
        velocityX = +1;
        velocityY = 0;
    }

    if (!obstaclesStarted) {
        obstaclesStarted = true;
        startObstacleGeneration();
    }
};

const startObstacleGeneration = () => {
    obstacleInterval = setInterval(() => {
        if (score >= 4) {
            generateFallingObstacle();
        }
    }, 2000);
};

const initGame = () => {
    if (gameOver) return handleGameOver();

    let htmlMarkup = '';

    if (score < 10 || (score >= 10 && snakeBody.length > 0)) {
        htmlMarkup += `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
    }

    if (snakeX === foodX && snakeY === foodY) {
        changFoodPosition();
        snakeBody.push([foodX, foodY]);
        score++;
        eatSound.currentTime = 0;
        eatSound.play();

        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerHTML = `Score: ${score}`;
        highScoreElement.innerHTML = `High Score: ${highScore}`;

        // ⚡ Aumentar velocidad cada 10 puntos con reducción de 50ms
        if (score % 10 === 0 && score / 10 > currentSpeedLevel) {
            currentSpeedLevel = score / 10;
            clearInterval(setIntervalid);
            speed = Math.max(50, speed - 50); // reducción fuerte
            setIntervalid = setInterval(initGame, speed);
        }
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY];
    snakeX += velocityX;
    snakeY += velocityY;

    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }

    if (obstaclesStarted) {
        for (let i = 0; i < obstacles.length; i++) {
            const obstacle = obstacles[i];
            obstacle.y += 0.5;

            if (obstacle.y > 30) {
                obstacles.splice(i, 1);
                i--;
                continue;
            }

            for (let j = 0; j < obstacle.length; j++) {
                htmlMarkup += `<div class="obstacle" style="grid-area: ${Math.floor(obstacle.y)} / ${obstacle.x + j}"></div>`;

                for (let k = 0; k < snakeBody.length; k++) {
                    const segmentX = snakeBody[k][0];
                    const segmentY = snakeBody[k][1];

                    if (segmentX === (obstacle.x + j) && segmentY === Math.floor(obstacle.y)) {
                        gameOver = true;
                        gameOverSound.currentTime = 0;
                        gameOverSound.play();
                    }
                }
            }
        }
    }

    playBoard.innerHTML = htmlMarkup;
};

changFoodPosition();
setIntervalid = setInterval(initGame, speed);
document.addEventListener("keydown", changeDirection);

document.getElementById("restartButton").addEventListener("click", () => {
    location.reload();
});