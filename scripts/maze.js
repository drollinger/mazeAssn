/**************************************************
 * Name: Dallin Drollinger
 * A#: A01984170
 * Description: Maze holds function needed to 
 *   process what the maze is. It uses a tree
 *   structure to find the longest path and 
 *   solution and the Prim algorithm to generate
 *   the maze.
 *************************************************/
'use strict';

let Maze = function() {
    let maze = [];
    let size;
    let root = null;
    let solution = [];
    const directions = [dir(-1,0), dir(1,0), dir(0,-1), dir(0,1),];

    function NewMaze(newSize) {
        size = newSize;
        maze = emptyMaze(size);
        root = maze[0][0];
        let options = [root];

        while (options.length > 0) {
            //Pick a random options
            let option = options[Math.floor(Math.random() * options.length)];
            //Find which it can connect to (parent or children is not null)
            let sides = [];
            let newOps = [];
            for (let d of directions) {
                let side = maze[option.y+d.y]?.[option.x+d.x];
                if (side?.parent || side?.children.length > 0 || side === root) {
                    sides.push(side);
                } else if (side && !options.includes(side)) {
                    newOps.push(side);
                }
            }
            //Pick a random connection and attach as child
            let side = sides[Math.floor(Math.random() * sides.length)];
            option.parent = side ?? null;
            side?.children.push(option);
            //Update heights in tree
            let heightCounter = 1;
            while (side?.height < heightCounter) {
                side.height = heightCounter;
                side = side.parent;
                heightCounter++;
            }
            //Remove old and Add new options to options list
            let index = options.indexOf(option);
            options.splice(index, 1);
            options.push(...newOps);
        };
        
        solveMaze();
        solution[solution.length-1].isStart = true;
        solution[0].isEnd = true;
    }

    function emptyMaze(size) {
        let newMaze = [];
        for (let row = 0; row < size; row++) {
            newMaze.push([]);
            for (let col = 0; col < size; col++) {
                newMaze[row].push({
                    x: col,
                    y: row, 
                    children: [],
                    parent: null,
                    height: 0,
                    isStart: false,
                    isEnd: false,
                });
            }
        }
        return newMaze;
    }

    function solveMaze() {
        //start at root
        solution.length = 0;
        let node = root;
        let subNode = {
            node : root,
            dist : 0,
        };
        
        //Find key nodes in tree for longest path
        while(node.height > 0) {
            let longest = getLongestPaths(node);
            node = longest.first;
            if (longest.second?.height+1 > subNode.dist) {
                subNode.node = longest.second;
                subNode.dist = longest.second.height+1;
            };
            subNode.dist++;
        };

        //Traverse node -> parent
        while (node != subNode.node.parent) {
            solution.push(node);
            node = node.parent;
        };
        //Check if node is null if subNode remains root
        if (node) {
            //Add parent -> subNode
            solution.push(node);
            node = subNode.node;
            while (node != null) {
                solution.push(node);
                node = getLongestPaths(node).first;
            };
        };
    }

    //Returns the top two node children with longest path(height)
    function getLongestPaths(node) {
        let first = null;
        let second = null;
        for (let n of node.children) {
            if (first === null || n.height > first.height) {
                second = first;
                first = n;
            } else if (second === null || n.height > second.height) {
                second = n;
            }
        }
        return {
            first : first,
            second : second,
        }
    }

    function dir(dx, dy) {
        return {x:dx, y:dy};
    }

    function GetMaze() {
        return maze;
    }

    function GetPath() {
        return solution;
    }

    function GetSize() {
        return size;
    }

    return {
        NewMaze : NewMaze,
        GetMaze : GetMaze,
        GetPath : GetPath,
        GetSize : GetSize,
    };
};
