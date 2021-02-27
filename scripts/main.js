/**************************************************
 * Name: Dallin Drollinger
 * A#: A01984170
 * Description: 
 *************************************************/
'use strict';

function main() {
    //Initialize
    //  Create Maze
    let input = Input();
    let keyInput = input.Keyboard();
    let graphics = Graphics();
    let maze = Maze();
    maze.NewMaze(5);
    let solution = maze.GetPath();

    graphics.InitRenderer( {
            maze : maze,
            wallRatio : 9
    });
    let character = {
        x : solution[solution.length-1].x,
        y : solution[solution.length-1].y,
    };
    let characterRenderer = graphics.CharacterRenderer( {
            character : character,
    });

    let mazeRenderer = graphics.MazeRenderer( {
            imgFloor : 'images/floorTile.png',
            imgWall : 'images/wall.png',
    });

    let prevTime = performance.now();
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
        characterRenderer.Render();
        //mazeRenderer.RenderPaths();
        //mazeRenderer.RenderSolution(solution);
    };
    
    function processInput(elapsedTime) {
        keyInput.update(elapsedTime);
    }

    requestAnimationFrame(gameLoop);
};

