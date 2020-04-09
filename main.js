let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

// ctx.beginPath();
// ctx.rect(20, 40, 50, 50);
// ctx.fillStyle = "#FF0000";
// ctx.fill();
// ctx.closePath();



// ctx.beginPath();
// ctx.rect(160, 10, 100, 40);
// ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
// ctx.stroke();
// ctx.closePath();

let ball = {
    x: 100,
    y: 100,
    dx: 5,
    dy: -5,
    radius: 20,
    color: "green",
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
        this.x += this.dx;
        this.y += this.dy;
    },
    onWallHit: Function(),
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
    ball.onWallHit(wall)
}

let pad = {
    x: 0,
    y: 0,
    height: 20,
    width: 100,
    color: "blue",
    draw() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

pad.x = (canvas.width - pad.width)/2;
pad.y = canvas.height - pad.height;

function drawAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ball.draw();
    pad.draw();
    checkCollisions();
    requestAnimationFrame(drawAll);
}

ball.onWallHit = function (wall) {
    if (wall === "left" || wall === "right") {
        this.dx = -this.dx;
    }
    else if (wall === "top") {
        this.dy = -this.dy;
    }
    else if (wall === "bottom") {
        this.dy = -this.dy;
        //alert("Game over");
    }
};

drawAll();
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = true;
    }
    else if (e.keyCode == 37) {
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    }
    else if (e.keyCode == 37) {
        leftPressed = false;
    }
}
function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        pad.x = relativeX - pad.width / 2;
    }
}