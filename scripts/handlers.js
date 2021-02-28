/**************************************************
 * Name: Dallin Drollinger
 * A#: A01984170
 * Description: Contains all handlers for input
 *************************************************/
'use strict';

let MazeHandlers = function(spec) {
    let mazeObj = spec.maze;
    let maze = mazeObj.GetMaze();
    let character = spec.character;
    let solution = spec.solution;
    let toggles = spec.toggles;
    let score = spec.score;

    let MoveUp = move('y', -1);
    let MoveDown = move('y', 1);
    let MoveLeft = move('x', -1);
    let MoveRight = move('x', 1);

    let ToggleSol = onPressOnly(function() {
        toggles.solPath = !toggles.solPath;
    });
    let ToggleCrumbs = onPressOnly(function() {
        toggles.crumbs = !toggles.crumbs;
    });
    let ToggleHint = onPressOnly(function() {
        toggles.hint = !toggles.hint;
    });

    let NewGame = function(size, update) {
        return (function() {
            mazeObj.NewMaze(size);
            maze = mazeObj.GetMaze();
            solution = mazeObj.GetPath();
            let start = solution.pop();
            character.x = start.x;
            character.y = start.y;
            character.tracks = [mazeObj.GetMaze()[start.y][start.x]];
            score.time = 0;
            score.points = 0;
            score.gameOver = false;
            update({maze:mazeObj});
        });
    };

    function onPressOnly(f) {
        return (function(key, elapsedTime) {
            if (!key.heldPress) f();
        });
    };

    function move(dir, inc) {
        return onPressOnly(function() {
            let cell = maze[character.y][character.x];
            for (let adj of cell.children.concat(cell.parent)) {
                if (adj?.[dir] === cell[dir] + inc && !score.gameOver) {
                    //Solution Handler
                    let correctDir = true;
                    let next = solution.pop();
                    if (character[dir]+inc != next?.[dir]) {
                        solution.push(next);
                        solution.push(maze[character.y][character.x]);
                        correctDir = false;
                    };

                    //Character Movement
                    character[dir] += inc;
                    let newSquare = maze[character.y][character.x];
                    if (character.tracks.indexOf(newSquare)===-1) {
                        character.tracks.push(newSquare);
                        score.points += correctDir ? 5 : -2;
                    }

                    //Turn off hint on movement
                    toggles.hint = false;

                    //Handle Game Over
                    if (solution.length == 0) {
                        score.gameOver = true;
                        let hscores = score.highscores[mazeObj.GetSize()];
                        let isHigh = hscores.length > 5 ? false : true;
                        for (let s of hscores) {
                            if (score.points > s) isHigh = true;
                        };

                        if (isHigh) {
                            hscores.push(score.points);
                            hscores.sort(function(a, b){return b-a});
                            if (hscores.length > 5) hscores.pop();
                        };
                    };
                };
            };
        });
    };

    return {
        MoveUp : MoveUp,
        MoveDown : MoveDown,
        MoveLeft : MoveLeft,
        MoveRight : MoveRight,
        ToggleSol : ToggleSol,
        ToggleCrumbs : ToggleCrumbs,
        ToggleHint : ToggleHint,
        NewGame : NewGame,
    };
};
