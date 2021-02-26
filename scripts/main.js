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
    let graphics = Graphics();
    let maze = Maze();
    maze.NewMaze(20);
    let solution = maze.GetPath();

    let mazeRenderer = graphics.MazeRenderer( {
            maze : maze,
            imgFloor : 'images/floorTile.png',
            imgWall : 'images/wall.png',
            wallRatio : 9
        });

    let characterRenderer = graphics.CharacterRenderer( {
            character : character,
            //imgcharacter : 'images/character.png',
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
        //mazeRenderer.RenderPaths();
        //mazeRenderer.RenderSolution(solution);
        //renderCharacter(myCharacter);
    };
    
    function processInput(elapsedTime) {
        keyInput.update(elapsedTime);
    }

    requestAnimationFrame(gameLoop);
};

