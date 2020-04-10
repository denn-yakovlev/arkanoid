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
        alert("Game over");
        game.onGameOver();        
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
}

function drawAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ball.draw();
    pad.draw();
    requestAnimationFrame(drawAll);
}

let game = {
    isOn: false,
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
    
    onGameOver: Function(),
}

game.onGameOver = function() {
    game.isOn = false;
    this.instantiate();
}

document.addEventListener("mousemove", pad.move, false);
document.addEventListener("keypress", game.start, false);
requestAnimationFrame(drawAll)
setInterval(checkCollisions, 50);
game.instantiate();


