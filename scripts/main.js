/**************************************************
 * Name: Dallin Drollinger
 * A#: A01984170
 * Description: 
 *************************************************/
'use strict';

function main() {
    //Initialize
    //  Create Maze
    //  Create all other needed objects
    let input = Input();
    let graphics = Graphics();
    let maze = Maze();
    maze.NewMaze(15);

    let mazeRenderer = graphics.MazeRenderer( {
            maze : maze,
            imgFloor : 'images/floorTile3.png',
            imgWall : 'images/hedge.png',
        });

    let prevTime = performance.now();
    let keyInput = input.Keyboard();

    //The Main Game Loop
    function gameLoop(timestamp) {
        let elapsedTime = timestamp - prevTime;
        prevTime = timestamp;

        processInput(elapsedTime);
        update(elapsedTime);
        render();

        requestAnimationFrame(gameLoop);
    };
    
    function update(elapsedTime) {
    };
    
    function render() {
        graphics.clear();
        mazeRenderer.Render();
        //renderCharacter(myCharacter);
    };
    
    function processInput(elapsedTime) {
        keyInput.update(elapsedTime);
    }

    requestAnimationFrame(gameLoop);
};

