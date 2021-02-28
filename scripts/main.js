/**************************************************
 * Name: Dallin Drollinger
 * A#: A01984170
 * Description: The main function with 
 *  inizialization of values and the game loop
 *************************************************/
'use strict';

function main() {
    //Initialize
    let input = Input();
    let keyInput = input.Keyboard();
    let graphics = Graphics();
    let maze = Maze();
    maze.NewMaze(5);
    let solution = maze.GetPath();
    let start = solution.pop();
    let highscores = {
        '5':[],
        '10':[],
        '15':[],
        '20':[],
    };
    let score = {
        time : 0,
        points : 0,
        gameOver : false,
        highscores : highscores,
    };

    graphics.InitRenderer( {
            maze : maze,
            wallRatio : 9
    });
    let character = {
        x : start.x,
        y : start.y,
        tracks : [maze.GetMaze()[start.y][start.x]],
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
        maze : maze,
        solution : solution,
        character : character,
        toggles : toggles,
        score : score,
    });
    keyInput.RegisterCommand(['a', 'j', 'ArrowLeft'], mazeHandlers.MoveLeft);
    keyInput.RegisterCommand(['d', 'l', 'ArrowRight'], mazeHandlers.MoveRight);
    keyInput.RegisterCommand(['w', 'i', 'ArrowUp'], mazeHandlers.MoveUp);
    keyInput.RegisterCommand(['s', 'k', 'ArrowDown'], mazeHandlers.MoveDown);
    keyInput.RegisterCommand(['p'], mazeHandlers.ToggleSol);
    keyInput.RegisterCommand(['b'], mazeHandlers.ToggleCrumbs);
    keyInput.RegisterCommand(['h'], mazeHandlers.ToggleHint);
    document.querySelectorAll('.newGame').forEach(item => {
        item.addEventListener('click', mazeHandlers.NewGame(item.getAttribute("data-size"), graphics.UpdateRenderer));
    });

    let prevTime = performance.now();
    requestAnimationFrame(gameLoop);

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
        if (!score.gameOver) score.time += elapsedTime;
    };
    
    function render() {
        graphics.clear();
        mazeRenderer.Render();
        if(toggles.solPath) mazeRenderer.RenderSolution(solution);
        if(toggles.hint) mazeRenderer.RenderSolution([solution[solution.length-1]]);
        if(toggles.crumbs) characterRenderer.RenderCrumbs();
        characterRenderer.Render();
        graphics.RenderScore(score);
    };
    
    function processInput(elapsedTime) {
        keyInput.Update(elapsedTime);
    }
};

