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
    maze.NewMaze(10);
    let solution = maze.GetPath();
    let start = solution.pop();

    graphics.InitRenderer( {
            maze : maze,
            wallRatio : 9
    });
    let character = {
        x : start.x,
        y : start.y,
    };
    let characterRenderer = graphics.CharacterRenderer( {
            character : character,
    });

    let mazeRenderer = graphics.MazeRenderer( {
            imgFloor : 'images/floorTile.png',
            imgWall : 'images/wall.png',
    });

    let toggles = {
        hint : false,
        crumbs : false,
        solPath : false,
    };

    let mazeHandlers = MazeHandlers( {
        maze : maze.GetMaze(),
        solution : solution,
        character : character,
        toggles : toggles,
    });
    keyInput.RegisterCommand(['a', 'j', 'ArrowLeft'], mazeHandlers.MoveLeft);
    keyInput.RegisterCommand(['d', 'l', 'ArrowRight'], mazeHandlers.MoveRight);
    keyInput.RegisterCommand(['w', 'i', 'ArrowUp'], mazeHandlers.MoveUp);
    keyInput.RegisterCommand(['s', 'k', 'ArrowDown'], mazeHandlers.MoveDown);
    keyInput.RegisterCommand(['p'], mazeHandlers.ToggleSol);
    keyInput.RegisterCommand(['b'], mazeHandlers.ToggleCrumbs);
    keyInput.RegisterCommand(['h'], mazeHandlers.ToggleHint);

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
        if(toggles.solPath) mazeRenderer.RenderSolution(solution);
        if(toggles.hint) mazeRenderer.RenderSolution(solution);
        if(toggles.crumbs) mazeRenderer.RenderSolution();
    };
    
    function processInput(elapsedTime) {
        keyInput.Update(elapsedTime);
    }

    requestAnimationFrame(gameLoop);
};

