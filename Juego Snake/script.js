const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const gameOverSound = document.getElementById("gameOverSound");
const eatSound = document.getElementById("eatSound"); // Agregar el sonido de la manzana

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let setIntervalid;
let score = 0;
let highScore = localStorage.getItem("high-score") || 0;
let speed = 130; // Velocidad inicial en milisegundos
let obstacles = []; // Array para almacenar obstáculos
highScoreElement.innerHTML = `High Score: ${highScore}`;

const changFoodPosition = () => {
    do {
        foodX = Math.floor(Math.random() * 30) + 1;
        foodY = Math.floor(Math.random() * 30) + 1;
    } while (!isPositionSafe(foodX, foodY)); // Verificar que la posición sea segura
}

const isPositionSafe = (x, y) => {
    for (let i = 0; i < snakeBody.length; i++) {
        if (Math.abs(snakeBody[i][0] - x) <= 1 && Math.abs(snakeBody[i][1] - y) <= 1) {
            return false; // La posición está demasiado cerca de la serpiente
        }
    }
    for (let i = 0; i < obstacles.length; i++) {
        for (let j = 0; j < obstacles[i].length; j++) {
            if (obstacles[i][j][0] === x && obstacles[i][j][1] === y) {
                return false; // La posición está ocupada por un obstáculo
            }
        }
    }
    return true; // La posición es segura
}

const generateObstacle = () => {
    const obstacleX = Math.floor(Math.random() * 30) + 1;
    const obstacleY = Math.floor(Math.random() * 30) + 1;
    const length = 6; // Cambiar longitud del obstáculo a 11
    const thickness = 6; // Grosor del obstáculo

    if ((obstacleX === foodX && obstacleY === foodY) || snakeBody.some(segment => segment[0] === obstacleX && segment[1] === obstacleY)) {
        return generateObstacle(); // Generar de nuevo si hay colisión
    }

    const isVertical = Math.random() < 0.5; // 50% de probabilidad de ser vertical

    if (isVertical) {
        if (obstacleY + length - 1 > 30 || obstacleY + thickness - 1 > 30) {
            return generateObstacle(); // Generar de nuevo si se sale del tablero
        }
        for (let i = 0; i < length; i++) {
            for (let j = 0; j < thickness; j++) {
                if (!isPositionSafe(obstacleX + j, obstacleY + i)) {
                    return generateObstacle(); // Generar de nuevo si está cerca de la serpiente
                }
            }
        }
        const obstaclePositions = [];
        for (let i = 0; i < length; i++) {
            for (let j = 0; j < thickness; j++) {
                obstaclePositions.push([obstacleX + j, obstacleY + i]);
            }
        }
        obstacles.push(obstaclePositions);
    } else {
        if (obstacleX + length - 1 > 30 || obstacleX + thickness - 1 > 30) {
            return generateObstacle(); // Generar de nuevo si se sale del tablero
        }
        for (let i = 0; i < length; i++) {
            for (let j = 0; j < thickness; j++) {
                if (!isPositionSafe(obstacleX + i, obstacleY + j)) {
                    return generateObstacle(); // Generar de nuevo si está cerca de la serpiente
                }
            }
        }
        const obstaclePositions = [];
        for (let i = 0; i < length; i++) {
            for (let j = 0; j < thickness; j++) {
                obstaclePositions.push([obstacleX + i, obstacleY + j]);
            }
        }
        obstacles.push(obstaclePositions);
    }
}

const handleGameOver = () => {
    clearInterval(setIntervalid);
    gameOverSound.currentTime = 0; // Reiniciar el tiempo del audio
    gameOverSound.play(); // Reproducir sonido de game over
    document.getElementById("finalScore").innerText = score; // Mostrar la puntuación final
    document.getElementById("gameOverModal").style.display = "block"; // Mostrar modal
}

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
}

const initGame = () => {
    if (gameOver) return handleGameOver();
    
    let htmlMarkup = '';
    
    // Generar la manzana en una posición válida
    if (score < 10 || (score >= 10 && snakeBody.length > 0)) {
        htmlMarkup += `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
    }

    // Si la serpiente come la manzana
    if (snakeX === foodX && snakeY === foodY) {
        changFoodPosition();
        snakeBody.push([foodX, foodY]);
        score++;
        eatSound.currentTime = 0; // Reiniciar el tiempo del audio
        eatSound.play(); // Reproducir sonido de comer manzana

        if (score % 10 === 0) {
            speed = Math.max(2, speed - 45);
            clearInterval(setIntervalid);
            setIntervalid = setInterval(initGame, speed);
        }

        if (score >= 7 && (score === 7 || (score - 7) % 5 === 0)) {
            generateObstacle();
        }

        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerHTML = `Score: ${score}`;
        highScoreElement.innerHTML = `High Score: ${highScore}`;
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

    for (let i = 0; i < obstacles.length; i++) {
        for (let j = 0; j < obstacles[i].length; j++) {
            htmlMarkup += `<div class="obstacle" style="grid-area: ${obstacles[i][j][1]} / ${obstacles[i][j][0]}"></div>`;
            if (snakeX === obstacles[i][j][0] && snakeY === obstacles[i][j][1]) {
                gameOver = true;
                gameOverSound.currentTime = 0; // Reiniciar el tiempo del audio
                gameOverSound.play(); // Reproducir sonido de game over al chocar con un obstáculo
            }
        }
    }

    playBoard.innerHTML = htmlMarkup;
}

changFoodPosition();
setIntervalid = setInterval(initGame, speed);
document.addEventListener("keydown", changeDirection);

document.getElementById("restartButton").addEventListener("click", () => {
    location.reload(); // Reiniciar el juego
});