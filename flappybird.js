//board and context for drawing
let board;
let context;

//bird class
let bird = 
{
    x : 0,
    y : 0,
    width : 34,
    height : 24,
    velocityY: 0,
    tiltAngle: 0,
}

//base class; make base width 2x larger for simulating base moving to left
let base =
{
    x : 0,
    width:  336*2,
    height: 112,
    velocityX: -0.75
}

//pipes array
let pipeArray = []; 

//physics
let gravity = 0.05;

//volume control
volume = 0.35;
const birdJumpAud = new Audio("audio/wing.wav");
birdJumpAud.volume = volume;
const gameOverAud = new Audio("audio/hit.wav");
gameOverAud.volume = volume;
const pointAud = new Audio("audio/point.wav");
gameOverAud.volume = volume;

let gameOver = false;

window.onload = function() 
{
    //load night background image
    //uncessary but may be needed when adding day->night, night->day cycle
    backgroundImg = new Image();
    backgroundImg.src = "sprites/background-night.png"

    //context for drawing on board
    board = document.getElementById("board");
    board.width = backgroundImg.width;
    board.height = backgroundImg.height;
    context = board.getContext("2d");

    //bird image
    birdImg = new Image();
    birdImg.src = "sprites/yellowbird-midflap.png"

    //place bird at starting position
    bird.x = board.width*3/8;
    bird.y = board.height/2;

    //base image
    baseImg = new Image();
    baseImg.src = "sprites/base.png"

    //top pipe image
    toppipeImg = new Image();
    toppipeImg.src = "sprites/pipe-green-top.png"

    //bot pipe image
    botpipeImg = new Image();
    botpipeImg.src = "sprites/pipe-green-bot.png"

    //start animation, draw new pipes, bird jump when key press
    requestAnimationFrame(update);
    setInterval(placePipes, 1.5 * 1000) //every 1.5 seconds
    document.addEventListener("mousedown", birdJump);
    document.addEventListener("keydown", birdJump);
}

function update()
{
    requestAnimationFrame(update);

    if(gameOver)
    {
        pipeArray = [];
        bird.x = board.width*3/8;
        bird.y = board.height/2;
        bird.velocityY = 0;

        return;
    }

    //clear previous pixels to allow for drawing new images
    context.clearRect(0, 0, board.width, board.height);

    //draw pipes
    for (let i = 0; i < pipeArray.length; i++)
    {
        let pipe = pipeArray[i];
        pipe.x += pipe.velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if(detectcollision(bird, pipe))
        {
            gameOver = true;
            gameOverAud.play();
        }

        if(pipe.passed == false && bird.x > pipe.x)
        {
            pointAud.play();
            pipe.passed = true;
        }
    }

    if(bird.y + bird.height > board.height - base.height)
    {
        gameOver = true;
        gameOverAud.play();
    }

    //calculate new bird y position after jumping + gravity
    bird.velocityY += gravity;
    //cap bird from going too much out of top of the screen
    bird.y = Math.max(bird.y + bird.velocityY, -25);

     // Accelerate the tilt angle upwards when jumping
    if (bird.velocityY < 0) {
        bird.tiltAngle -= 1; // Increase tilt angle upwards
        if (bird.tiltAngle < -25) { // Limit the maximum tilt angle
            bird.tiltAngle = -25;
        }
    }

    // Rotate the bird downward if it's falling
    if (bird.velocityY > 0) {
        bird.tiltAngle += 1; // Increase tilt angle downwards
        if (bird.tiltAngle > 90) { // Limit the maximum tilt angle
            bird.tiltAngle = 90;
        }
    }

    //draw bird
    context.save();
    context.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
    context.rotate((Math.PI / 180) * bird.tiltAngle);
    context.drawImage(birdImg, -bird.width / 2, -bird.height / 2, bird.width, bird.height);
    context.restore();

    base.x += base.velocityX;

    if(base.x <= -board.width)
    {
        base.x = 0;
    }

    //draw base
    context.drawImage(baseImg, base.x, board.height*25/32, base.width, base.height)

    //clear pipes
    while(pipeArray.length > 0 && pipeArray[0].x < -board.width/2)
    {
        pipeArray.shift();
    }
}

function placePipes() 
{
    let randompipeY = -320/4 - Math.random()*(320/2)
    let spacing = board.height/5

    let topPipe = 
    {
        img : toppipeImg,
        x : board.width,
        y : randompipeY,
        width : 52,
        height: 320,
        velocityX: -0.75,
        passed : false
    }

    pipeArray.push(topPipe)

    let botPipe = 
    {
        img : botpipeImg,
        x : board.width,
        y : randompipeY + 320 + spacing,
        width : 52,
        height: 320,
        velocityX: -0.75,
        passed : false
    }

    pipeArray.push(botPipe)
}

function birdJump(b)    
{
    //button 0 is left mouse click; key code 32 is spacebar
    if(b.keyCode == 32 || b.button == 0)
    {
        gameOver = false;
        
        birdJumpAud.play();
    
        bird.tiltAngle = -65
        bird.velocityY = -2.4;
    }
}

function detectcollision(a, b)
{
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}