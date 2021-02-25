let previousTimeStamp = performance.now();

let myRectangle1 = {
    x: 200,
    y: 100,
    width: 200,
    height: 200,
    fillStyle: 'rgba(0, 0, 255, 1)',
    strokeStyle: 'rgba(255, 0, 0, 1)',
    rotation: 0
};

let myTriangle = {
    center: { x: 500, y: 200 },
    pt1: { x: 500, y: 100 },
    pt2: { x: 600, y: 300 },
    pt3: { x: 400, y: 300 },
    fillStyle: 'rgba(0, 255, 0, 0.75)',
    strokeStyle: 'rgba(255, 0, 0, 1)',
    rotation: 45
};

let myTexture = {
    imageSrc: 'images/sessler.jpg',
    center: { x: 250, y: 400},
    width: 200,
    height: 200,
    rotation: 0
};

myTexture.ready = false;
myTexture.image = new Image();
myTexture.image.onload = function() {
    myTexture.ready = true;
};
myTexture.image.src = myTexture.imageSrc;

function update(timeStamp) {
    myRectangle1.rotation += Math.PI / 200;
    myTriangle.rotation += Math.PI / 200;
    myTexture.rotation -= Math.PI / 200;
}

function render() {
    Graphics.clear();
    Graphics.drawRectangle(myRectangle1);
    Graphics.drawTriangle(myTriangle);
    Graphics.drawTexture(myTexture);
}

function gameLoop(timeStamp) {
    let elapsedTime = timeStamp - previousTimeStamp;

    update(elapsedTime);
    render();

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
