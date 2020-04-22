var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var ball = {
    x: 20,
    y: 20,
    dx: 5,
    dy: 2,
    radius: 10
};

var paddle = {
    width: 70,
    height: 10,
    x: 0,
    y: canvas.height - 10,
    speed: 10,

    isMovingLeft: false,
    ismovingRight: false
};

var brickConfig = {
    offsetX: 25,
    offsetY: 25,
    margin: 25,
    width: 70,
    height: 15,
    totalRow: 3,
    totalCol: 5
};

var isGameOver = false;
var isGameWin = false;
var userScore = 0;
var maxScore = brickConfig.totalRow * brickConfig.totalCol * 100;

var brickList = [];

for (var i = 0; i < brickConfig.totalRow; i++) {
    for (var j = 0; j < brickConfig.totalCol; j++) {
        brickList.push({
            x: brickConfig.offsetX + j * (brickConfig.width + brickConfig.margin),
            y: brickConfig.offsetY + i * (brickConfig.height + brickConfig.margin),
            isBroken: false
        });
    }
}

document.addEventListener('keyup', function (event) {
    console.log('KEY UP');
    console.log(event);

    if (event.keyCode === 37) {
        paddle.isMovingLeft = false;
    } else if (event.keyCode === 39) {
        paddle.ismovingRight = false;
    }
});

document.addEventListener('keydown', function (event) {
    console.log('KEY DOWN');
    console.log(event);

    if (event.keyCode === 37) {
        paddle.isMovingLeft = true;
    } else if (event.keyCode === 39) {
        paddle.ismovingRight = true;
    }
});

function drawBall() {
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    context.fillStyle = 'red';
    context.fill();
    context.closePath();
}

function drawPaddle() {
    context.beginPath();
    context.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    context.fill();
    context.closePath();
}

// 2 * OFFSET + 5 * WIDTH + 4 * MARGIN = 500
// OFFSET = MARGIN = 25
// => WIDTH = 70

// ROW = 3
// COL = 5

function drawBricks() {
    brickList.forEach(function (b) {
        if (b.isBroken === false) {
            context.beginPath();
            context.rect(b.x, b.y, brickConfig.width, brickConfig.height);
            context.fill();
            context.closePath();
        }
    });
}

function handleBallCollideBound() {
    if (ball.x < ball.radius || ball.x > canvas.width - ball.radius) {
        ball.dx = -ball.dx;
    }
    if (ball.y < ball.radius) {
        ball.dy = -ball.dy;
    }
}

function handleBallCollidePaddle() {
    if (ball.x + ball.radius >= paddle.x && ball.x + ball.radius <= paddle.x + paddle.width &&
        ball.y + ball.radius >= canvas.height - paddle.height) {
        ball.dy = -ball.dy;
    }
}

function handleBallCollideBricks() {
    brickList.forEach(function (b) {
        if (b.isBroken === false) {
            if (ball.x >= b.x && ball.x <= b.x + brickConfig.width &&
                ball.y + ball.radius >= b.y && ball.y - ball.radius <= b.y + brickConfig.height) {
                ball.dy = - ball.dy;
                b.isBroken = true;
                userScore += 100;
                if (userScore >= maxScore) {
                    isGameOver = true;
                    isGameWin = true;
                }
            }
        }
    });
}

function updateBallPosition() {
    ball.x += ball.dx;
    ball.y += ball.dy;
}

function updatePaddlePosition() {
    if (paddle.isMovingLeft === true) {
        paddle.x -= paddle.speed;
    } else if (paddle.ismovingRight === true) {
        paddle.x += paddle.speed;
    }

    if (paddle.x < 0) {
        paddle.x = 0;
    } else if (paddle.x > canvas.width - paddle.width) {
        paddle.x = canvas.width - paddle.width;
    }
}

function checkGameOver() {
    if (ball.y > canvas.height - ball.radius) {
        isGameOver = true;
    }
}

function handleGameOver() {
    if (isGameWin === true) {
        alert('YOU WON !!!');
    } else {
        alert('Thua rùi kìa, ahihi');
    }

}

function draw() {
    if (isGameOver === false) {
        context.clearRect(0, 0, canvas.clientWidth, canvas.height);
        drawBall();
        drawPaddle();
        drawBricks();

        handleBallCollideBound();
        handleBallCollidePaddle();
        handleBallCollideBricks();

        updateBallPosition();
        updatePaddlePosition();

        checkGameOver();

        requestAnimationFrame(draw);
    } else {
        handleGameOver();
    }
}

draw();
