var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var ball = {
    x: canvas.width * 0.5,
    y: canvas.height - 20,
    dx: -4,
    dy: 9,
    radius: 20
};

var paddle = {
    width: 200,
    height: 20,
    x: canvas.width * 0.5 - 100,
    y: canvas.height - 20,
    speed: 10,

    isMovingLeft: false,
    ismovingRight: false
};

var brickConfig = {
    offsetX: 25,
    offsetY: 25,
    margin: 35,
    width: 100,
    height: 20,
    totalRow: 3,
    totalCol: 10
};

var isGameOver = false;
var isGameWin = false;

// score
var userScore = 0;
var htmlScore = document.getElementById('score');
var calculateScore = function () {
    var content = '<h1> ' + 'Score: ' + userScore + '</h1>';
    htmlScore.innerHTML = content;
};

// level
var userLevel = 1;
var htmlLevel = document.getElementById('level');
var calculateLevel = function () {
    var content = '<h1> ' + 'Level: ' + userLevel + '</h1>';
    htmlLevel.innerHTML = content;
}

var maxScore = brickConfig.totalRow * brickConfig.totalCol * 100;
var maxLevel = 5;

var brickList = [];

// tao ma tran cac vien gach
function buildBrickMap() {
    for (var i = 0; i < brickConfig.totalRow; i++) {
        for (var j = 0; j < brickConfig.totalCol; j++) {
            brickList.push({
                x: brickConfig.offsetX + j * (brickConfig.width + brickConfig.margin),
                y: brickConfig.offsetY + i * (brickConfig.height + brickConfig.margin),
                isBroken: false
            });
        }
    }
}

// ====================DI CHUYEN THANH CHAN====================

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

// ============TAO VAT THE (BONG, THANH CHAN, GACH)============

function drawBall() {
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    context.fillStyle = 'green';
    context.fill();
    context.closePath();
}

function drawPaddle() {
    context.beginPath();
    context.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    context.fillStyle = 'blue';
    context.fill();
    context.closePath();
}

// 2 * offset + n * brick.width + (n - 1) * margin = canvas.width
// => ...

function drawBricks() {
    brickList.forEach(function (b) {
        if (b.isBroken === false) {
            context.beginPath();
            context.rect(b.x, b.y, brickConfig.width, brickConfig.height);
            context.fillStyle = 'red';
            context.fill();
            context.closePath();
        }
    });
}

// ======================CAC XU LY DUNG DO=====================

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
                if (userScore === maxScore && userLevel >= maxLevel) {
                    isGameOver = true;
                    isGameWin = true;
                }
            }
        }
    });
}

// ============CAP NHAT VI TRI (BONG VA THANH CHAN)============

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

// ===============KIEM TRA VA XU LY KET THUC GAME==============

function checkGameOver() {
    if (ball.y > canvas.height - ball.radius) {
        isGameOver = true;
    }

    if (brickList.length === 0) {
        if (userLevel > maxLevel) {
            isGameOver = true;
            isGameWin = true;
        } else {            
            calculateLevel();
            buildBrickMap();
            ++userLevel;
            ball.dx = -ball.dx;
        }
    }
}

function handleGameOver() {
    if (isGameWin === true) {
        alert('YOU WON !!!');
    } else {
        alert('Thua rùi kìa, ahihi');
    }

}

//
function resetAndUpdate() {
    if (isGameOver === false) {
        handleBallCollideBound();
        handleBallCollidePaddle();
        handleBallCollideBricks();

        updateBallPosition();
        updatePaddlePosition();

        checkGameOver();
    } else {
        handleGameOver();
    }
}

// ======================HAM CHINH (MAIN)======================

function draw() {
    if (isGameOver === false) {
        calculateScore();
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

calculateLevel();
draw();
