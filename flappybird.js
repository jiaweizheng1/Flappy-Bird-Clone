//board
let board;
let boardWidth = 288;
let boardHeight = 512;
let context;

//bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth*3/8;
let birdY = boardHeight/2;
let birdImg;

let bird = 
{
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 52;
let pipeHeight = 320;
let pipeX = boardWidth;
let pipeY = 0;

let toppipeImg;
let botpipeImg;

//physics
let velocityX = -0.75;

window.onload = function() 
{
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //context for drawing on board

    //bird
    birdImg = new Image();
    birdImg.src = "sprites/yellowbird-midflap.png"

    //base
    baseImg = new Image();
    baseImg.src = "sprites/base.png"

    //top pipe
    toppipeImg = new Image();
    toppipeImg.src = "sprites/pipe-green-top.png"

    //bot pipe
    botpipeImg = new Image();
    botpipeImg.src = "sprites/pipe-green-bot.png"

    requestAnimationFrame(update);
    setInterval(placePipes, 1.5 * 1000) //every 1.5 seconds
}

function update()
{
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    //draw bird
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    //draw pipes
    for (let i = 0; i < pipeArray.length; i++)
    {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
    }

    //draw base
    context.drawImage(baseImg, 0, boardHeight*25/32, baseImg.width, baseImg.height)
}

function placePipes() 
{
    let randompipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2)
    let spacing = boardHeight/5

    let topPipe = 
    {
        img : toppipeImg,
        x : pipeX,
        y : randompipeY,
        width : pipeWidth,
        height: pipeHeight,
        passed : false
    }

    pipeArray.push(topPipe)

    let botPipe = 
    {
        img : botpipeImg,
        x : pipeX,
        y : randompipeY + pipeHeight + spacing,
        width : pipeWidth,
        height: pipeHeight,
        passed : false
    }

    pipeArray.push(botPipe)
}