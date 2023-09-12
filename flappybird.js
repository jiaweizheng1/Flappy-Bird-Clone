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
    tiltAngle: 0 
}

//pipes array
let pipeArray = []; 

//physics
let gravity = 0.025;

//volume control
volume = 0.5;

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

    //clear previous pixels to allow for drawing new images
    context.clearRect(0, 0, board.width, board.height);

    //draw pipes
    for (let i = 0; i < pipeArray.length; i++)
    {
        let pipe = pipeArray[i];
        pipe.x += pipe.velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
    }

    //calculate new bird y position after jumping + gravity
    bird.velocityY += gravity*2;
    bird.y += bird.velocityY;

    //draw bird
    context.save();
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    context.restore();

    //draw base
    context.drawImage(baseImg, 0, board.height*25/32, baseImg.width, baseImg.height)
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
        const birdJumpAud = new Audio("audio/wing.wav");

        birdJumpAud.volume = volume;
        birdJumpAud.play();
    
        bird.velocityY = -2.4;
    }
}