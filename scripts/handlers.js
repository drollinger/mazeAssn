/**************************************************
 * Name: Dallin Drollinger
 * A#: A01984170
 * Description: 
 *************************************************/
'use strict';

let MazeHandlers = function(spec) {
    let maze = spec.maze;
    let character = spec.character;
    let solution = spec.solution;
    let toggles = spec.toggles;

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

    function onPressOnly(f) {
        return (function(key, elapsedTime) {
            if (!key.heldPress) f();
        });
    };

    function move(dir, inc) {
        return onPressOnly(function() {
            let cell = maze[character.y][character.x];
            for (let adj of cell.children.concat(cell.parent)) {
                if (adj?.[dir] === cell[dir] + inc) {
                    //Solution Handler
                    let next = solution.pop();
                    if (character[dir]+inc != next[dir]) {
                        solution.push(next);
                        solution.push(maze[character.y][character.x]);
                    };
                    //Character Movement
                    character[dir] += inc;
                    let newSquare = maze[character.y][character.x];
                    if (character.tracks.indexOf(newSquare)===-1) character.tracks.push(newSquare);
                    character.tracks
                    //Turn off hint on movement
                    toggles.hint = false;
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
    };
};
