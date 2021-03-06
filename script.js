var canvasSize;

const mouseWatcher = new wrk.MouseWatcher(document);

const padding = 20;
const gridSize = wrk.v(20, 20);
const bgColor = 0;
const fps = 7.5;

const rKey = 82;

const maxApples = 1;
const appleChance = 0.4;

var snake;
var apples;

var canvas;

function findOptimalCanvasSize() {
    var viewportSize = wrk.dom.viewportSize();
    var viewportAspectRatio = viewportSize.x / viewportSize.y;

    var canvasAspectRatio = gridSize.x / gridSize.y;

    // If the grid is more narrow, then use its height
    if (viewportAspectRatio > canvasAspectRatio) {
        var canvasHeight = viewportSize.y - padding;
        var canvasWidth = canvasHeight / gridSize.y * gridSize.x;
        return wrk.v(canvasWidth, canvasHeight);
    }
    // Else use its width
    else {
        var canvasWidth = viewportSize.x - padding;
        var canvasHeight = canvasWidth / gridSize.x * gridSize.y;
        return wrk.v(canvasWidth, canvasHeight);
    }
}

function reset() {
    snake = new Snake(wrk.v.copyDiv(gridSize, 2), 3);
    apples = [];
}

function showStartText() {
    push();

    fill(255);
    stroke(0);
    strokeWeight(4);
    textSize(canvasSize.x / gridSize.x * 2);

    text('SNAKE', canvasSize.x / 2, canvasSize.y * 0.35);

    textSize(canvasSize.x / gridSize.x);
    text('PLAY USING ARROW KEYS OR WASD\nCLICK TO START',
        canvasSize.x / 2, canvasSize.y * 0.5);

    pop();
}

function drawScore() {
    push();
    fill(255);
    stroke(0);
    strokeWeight(2);
    textSize(canvasSize.x / gridSize.x);

    var textToWrite = `SCORE: ${snake.length}    HI: ${getHighScore()}`;
    text(textToWrite, canvasSize.x / 2, canvasSize.y * 0.95);

    pop();
}

function showLoseText() {
    push();

    fill(255);
    stroke(0);
    strokeWeight(4);
    textSize(canvasSize.x / gridSize.x * 2);

    text(`YOU LOSE`, canvasSize.x / 2, canvasSize.y / 2 - 50 * 2);

    strokeWeight(4);
    textSize(canvasSize.x / gridSize.x);

    var textToWrite =
`SCORE: ${snake.length}
HIGH SCORE: ${getHighScore()}
PRESS R TO RESTART`;

    text(textToWrite, canvasSize.x / 2, canvasSize.y / 2 - 50 / 2);

    pop();
}

function spawnApples() {
    if (apples.length < maxApples &&
        wrk.randflt(0, 1) < appleChance) {
        var coord = wrk.v.random(wrk.v(0, 0), gridSize, false);
        var apple = new Apple(coord);
        apples.push(apple);
    }
}

function setup() {
    canvas = createCanvas(1, 1);
    rectMode(CORNER);
    textAlign(CENTER);
    frameRate(fps);
}

var waitingToStart = true;

function draw() {
    // The resizing needs to be before background,
    // as resizing clears canvas
    canvasSize = findOptimalCanvasSize();
    resizeCanvas(canvasSize.x, canvasSize.y);

    var cellSize = canvasSize.x / gridSize.x;

    background(0, 0, 0);

    if (waitingToStart) {
        showStartText();
        if (mouseWatcher.pointerDown) {
            waitingToStart = false;
            reset();
        }

        // We don't want to do anything else, so just exit draw
        return;
    }

    if (keyIsDown(rKey)) {
        reset();
    }

    apples.forEach(apple => apple.draw(cellSize));
    snake.update(cellSize, gridSize, apples);

    if (snake.alive) {
        spawnApples();
        if (snake.length > getHighScore()) setHighScore(snake.length);
        drawScore();
    }

    else {
        showLoseText();
    }
}

reset();