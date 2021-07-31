

// select canvas element
const canvas = document.getElementById("pong");

// getContext of canvas = methods and properties to draw and do a lot of thing to the canvas
const ctx = canvas.getContext('2d');

// load sounds
let hit = new Audio();
let wall = new Audio();
let userScore = new Audio();
let comScore = new Audio();
let gameControl = localStorage.getItem("gameControl") === null ? true : JSON.parse(localStorage.getItem("gameControl"))
let soundControl = localStorage.getItem("soundControl") === null ? true : JSON.parse(localStorage.getItem("soundControl"))

console.log(gameControl)

hit.src = !soundControl ? "sounds/sounds_hit.mp3" : "";
wall.src = !soundControl ? "sounds/sounds_wall.mp3" : "";
comScore.src = !soundControl ? "sounds/sounds_comScore.mp3" : "";
userScore.src = !soundControl ? "sounds/sounds_userScore.mp3" : "";
button.innerHTML = !soundControl ? `<svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#000"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-volume-2"
      >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path
          d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"
        ></path>
      </svg>`: `<svg xmlns="http://www.w3.org/2000/svg" 
      width="30" 
      height="30" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="#000" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      class="feather 
      feather-volume-x">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15">
      </line>
  </svg>`

// Ball object

let ball;
function controlBallState() {
    ball = gameControl ? {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 10,
        velocityX: 5,
        velocityY: 5,
        speed: 7,
        color: "#fff"
    } : {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 10,
        velocityX: 0,
        velocityY: 0,
        speed: 0,
        color: "#fff"
    }
}

controlBallState()

// User Paddle
const user = {
    x: 2.2, // left side of canvas
    y: (canvas.height - 100) / 2, // -100 the height of paddle
    width: 10,
    height: 100,
    score: 0,
    color: "#fff"
}

// COM Paddle
const com = {
    x: canvas.width - 12, // - width of paddle
    y: (canvas.height - 100) / 2, // -100 the height of paddle
    width: 10,
    height: 100,
    score: 0,
    color: "#fff"
}

// NET
const net = {
    x: (canvas.width - 2) / 2,
    y: 0,
    height: 10,
    width: 2,
    color: "#fff"
}

// draw a rectangle, will be used to draw paddles
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// draw circle, will be used to draw the ball
function drawArc(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

// listening to the mouse
gameControl && canvas.addEventListener("mousemove", getMousePos);
document.addEventListener("keyup", pauseTheGame);
button.addEventListener("click", removeSound)


function getMousePos(evt) {
    let rect = canvas.getBoundingClientRect();
    user.y = evt.clientY - rect.top - user.height / 2;
}

function pauseTheGame(e) {
    if(e.keyCode !== 70) {
        return;
    }
    ball.x = canvas.width / 2,
    ball.y = canvas.height / 2,
    ball.velocityX = gameControl ? 0 : 5;
    ball.velocityY = gameControl ? 0 : 5;
    ball.speed = gameControl ? 0 : 5;
    gameControl ? canvas.removeEventListener("mousemove", getMousePos) : canvas.addEventListener("mousemove", getMousePos);
    gameControl = !gameControl;
    localStorage.setItem("gameControl", JSON.stringify(gameControl))
}

function removeSound(e) {
    hit.src = soundControl ? "sounds/sounds_hit.mp3" : "";
    wall.src = soundControl ? "sounds/sounds_wall.mp3" : "";
    comScore.src = soundControl ? "sounds/sounds_comScore.mp3" : "";
    userScore.src = soundControl ? "sounds/sounds_userScore.mp3" : "";
    button.innerHTML = soundControl ? `<svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#000"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-volume-2"
      >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path
          d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"
        ></path>
      </svg>`: `<svg xmlns="http://www.w3.org/2000/svg" 
      width="30" 
      height="30" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="#000" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      class="feather 
      feather-volume-x">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15">
      </line>
  </svg>`
    soundControl = !soundControl
    localStorage.setItem("soundControl", JSON.stringify(soundControl))
}

// when COM or USER scores, we reset the ball
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
}

// draw the net
function drawNet() {
    for (let i = 0; i <= canvas.height; i += 15) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

// draw text
function drawText(text, x, y) {
    ctx.fillStyle = "#FFF";
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);
}

// collision detection
function collision(b, p) {
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

// update function, the function that does all calculations
function update() {

    // change the score of players, if the ball goes to the left "ball.x<0" computer win, else if "ball.x > canvas.width" the user win
    if (ball.x - ball.radius < 0) {
        com.score++;
        comScore.play();
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        user.score++;
        userScore.play();
        resetBall();
    }

    // the ball has a velocity
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // computer plays for itself, and we must be able to beat it
    // simple AI
    com.y += ((ball.y - (com.y + com.height / 2))) * 0.1;

    // when the ball collides with bottom and top walls we inverse the y velocity.
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.velocityY = -ball.velocityY;
        wall.play();
    }

    // we check if the paddle hit the user or the com paddle
    let player = (ball.x + ball.radius < canvas.width / 2) ? user : com;

    // if the ball hits a paddle
    if (collision(ball, player)) {
        // play sound
        hit.play();
        // we check where the ball hits the paddle
        let collidePoint = (ball.y - (player.y + player.height / 2));
        // normalize the value of collidePoint, we need to get numbers between -1 and 1.
        // -player.height/2 < collide Point < player.height/2
        collidePoint = collidePoint / (player.height / 2);

        // when the ball hits the top of a paddle we want the ball, to take a -45degees angle
        // when the ball hits the center of the paddle we want the ball to take a 0degrees angle
        // when the ball hits the bottom of the paddle we want the ball to take a 45degrees
        // Math.PI/4 = 45degrees
        let angleRad = (Math.PI / 4) * collidePoint;

        // change the X and Y velocity direction
        let direction = (ball.x + ball.radius < canvas.width / 2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        // speed up the ball everytime a paddle hits it.
        ball.speed += 0.1;
    }
}

// render function, the function that does al the drawing
function render() {

    // clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, "#000");

    // draw the user score to the left
    drawText(user.score, canvas.width / 4, canvas.height / 5);

    // draw the COM score to the right
    drawText(com.score, 3 * canvas.width / 4, canvas.height / 5);

    // draw the net
    drawNet();

    // draw the user's paddle
    drawRect(user.x, user.y, user.width, user.height, user.color);

    // draw the COM's paddle
    drawRect(com.x, com.y, com.width, com.height, com.color);

    // draw the ball
    drawArc(ball.x, ball.y, ball.radius, ball.color);
}
function game() {
    update();
    render();
}
// number of frames per second
// let framePerSecond = 50;
let speed = 100
let lastPaintTime = 0


/**
 * Game loop
 */
//call the game function 50 times every 1 Sec
// let loop = setInterval(game, 1000 / framePerSecond);


// Game functions
const main = (ctime) => {
    window.requestAnimationFrame(main)
    if((ctime - lastPaintTime)/1000 < 1/speed) {
        return
    } 
    lastPaintTime = ctime
    game()
}

window.requestAnimationFrame(main)