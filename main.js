let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

let ball = {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    radius: 20,
    color: "green",
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
        ball.move();
    },
    move() {
        this.x += this.dx;
        this.y += this.dy;
    },
    onWallHit: Function(),
    onPadHit: Function(),
}

ball.onWallHit = function (wall) {
    if (wall === "left" || wall === "right") {
        this.dx = -this.dx;
    }
    else if (wall === "top") {
        this.dy = -this.dy;
    }
    else if (wall === "bottom") {
        game.lives--;
        game.isOn = false;
        if (game.lives == 0) {
            game.onGameOver();
        }       
        else {
            game.instantiate();
        }
    }
};

ball.onPadHit = function() {
    this.dy = -this.dy
}

let pad = {
    x: 0,
    y: 0,
    height: 25,
    width: 100,
    color: "blue",
    draw() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    },
    move(e) {
        if (game.isOn) {
            var relativeX = e.clientX - canvas.offsetLeft;
            if (relativeX > 0 && relativeX < canvas.width) {
                pad.x = relativeX - pad.width / 2;
            }
        } 
    }
}

class Brick {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.color = "#4f4f4f";
        this.width = w;
        this.height = h;
        this.isDestroyed = false;
    };
    draw() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();      
    };
    onDestroy(i, j) {
        ball.dy = -ball.dy;
        ctx.clearRect(this.x, this.y, this.width, this.height);
        game.bricks[i][j].isDestroyed = true;
        game.score++;
        if (game.score == game.maxScore) {
            game.onWin();
        }
    }
}

function spawnBricks(rows, cols) {
    let marginX = 50;
    let marginY = 75;
    let paddingX = 10;
    let paddingY = 10;
    let width = 75;
    let height = 25;
    let bricks = new Array(rows);
    for (let i = 0; i < rows; i++) {
        bricks[i] = new Array(cols);
        for (let j = 0; j < cols; j++) {
            bricks[i][j] = new Brick(
                marginX + j * (width + paddingX),
                marginY + i * (height + paddingY),
                width,
                height
                );
        }
    }
    return bricks;
}

function drawBricks(bricks) {
    for (let i = 0; i < bricks.length; i++) {
        for (let j = 0; j < bricks[i].length; j++) {
            if (!bricks[i][j].isDestroyed) {
                bricks[i][j].draw();
            }
        }
    }
}

function checkCollisions() {
    let wall;
    if (ball.x < ball.radius) {
        wall = "left";
    }
    else if (ball.x + ball.radius > canvas.width) {
        wall = "right";
    }
    else if (ball.y < ball.radius) {
        wall = "top";
    }
    else if (ball.y + ball.radius > canvas.height) {
        wall = "bottom";
    }
    ball.onWallHit(wall);
    const COS45 = Math.cos(Math.PI / 4);
    if (ball.x >= pad.x - ball.radius * COS45 
        && ball.x <= pad.x + pad.width + ball.radius * COS45
        && ball.y >= pad.y - ball.radius * COS45
        && ball.y <= pad.y
        )
    {
        ball.onPadHit();
    }
    for (let i = 0; i < game.bricks.length; i++) {
        for (let j = 0; j < game.bricks[i].length; j++) {
            const brick = game.bricks[i][j];
            if (!brick.isDestroyed
                && ball.x >= brick.x - ball.radius * COS45 
                && ball.x <= brick.x + brick.width + ball.radius * COS45
                && ball.y >= brick.y - ball.radius * COS45
                && ball.y <= brick.y + brick.height + ball.radius * COS45
                )
            {
                brick.onDestroy(i, j);
            }
        }
    }
}
 

function drawAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ball.draw();
    pad.draw();
    drawBricks(game.bricks);
    ctx.font = "16px Arial";
    ctx.fillText(`Score: ${game.score}/${game.maxScore}`, 20, 20);
    ctx.fillText(`Lives: ${game.lives}`, 640, 20);
    if (!game.isOn) {
        ctx.fillText("Press any key to start", 320, 20);
    }
    requestAnimationFrame(drawAll);
}

let game = {
    isOn: false,
    bricks: [],
    score: 0,
    lives: 3,
    maxScore: 24,
    instantiate() {
        pad.x = (canvas.width - pad.width)/2;
        pad.y = canvas.height - pad.height;
        ball.x = pad.x + pad.width / 2;
        ball.y = pad.y - ball.radius;
        ball.dx = 0;
        ball.dy = 0;
    },
    start() {
        game.isOn = true;
        ball.dx = 5;
        ball.dy = -5;
    },
    setNewGame() {
        this.instantiate();
        this.bricks = spawnBricks(3, 8);
        this.score = 0;
        this.lives = 3;
    },
    onGameOver: Function(),
    onWin: Function(),
}

game.onGameOver = function() {
    game.isOn = false;
    alert("Game over!");
    this.setNewGame();
}

game.onWin = function() {
    game.isOn = false;
    alert("You won!");
    this.setNewGame();
}

document.addEventListener("mousemove", pad.move, false);
document.addEventListener("keypress", game.start, false);
requestAnimationFrame(drawAll)
setInterval(checkCollisions, 50);
game.setNewGame();