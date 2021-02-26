/**************************************************
 * Name: Dallin Drollinger
 * A#: A01984170
 * Description: 
 *************************************************/
'use strict';

let Graphics = function() {
    'use strict';
    
    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d');

    CanvasRenderingContext2D.prototype.clear = function() {
        this.save();
        this.setTransform(1, 0, 0, 1, 0, 0);
        this.clearRect(0, 0, canvas.width, canvas.height);
        this.restore();
    };
    function clear() {
        context.clear();
    }

    function MazeRenderer(spec) {
        let imgFloor = new Image();
        imgFloor.isReady = false;
        imgFloor.onload = function() {
            this.isReady = true;
        };
        imgFloor.src = spec.imgFloor;

        let imgWall = new Image();
        imgWall.isReady = false;
        imgWall.onload = function() {
            this.isReady = true;
        };
        imgWall.src = spec.imgWall;
        let wallRatio = spec.wallRatio ?? 10;

        let size = spec.maze.GetSize();
        let maze = spec.maze.GetMaze();
        let cWidth = canvas.width/size;
        let cHeight = canvas.height/size;
        let wThickW = canvas.width/size/wallRatio;
        let wThickH = canvas.height/size/wallRatio;

        function Render() {
            drawCells();
        };

        function drawCells() {
            for (let row = 0; row < size; row++) {
                for (let col = 0; col < size; col++) {
                    drawFloor(maze[row][col]);
                }
            }
            for (let row = 0; row < size; row++) {
                for (let col = 0; col < size; col++) {
                    drawWall(maze[row][col]);
                }
            }
        }

        function drawFloor(cell) {
            if (imgFloor.isReady) {
                context.drawImage(imgFloor,
                cell.x * cWidth, cell.y * cHeight,
                cWidth + 0.5, cHeight + 0.5);
            };
        };

        function drawWall(cell) {
            let walls = getWallCoord(cell);

            for (let [key, w] of Object.entries(walls)) {

                let x = cell.x*cWidth + (key === '-1' ? cWidth-wThickW:0);
                let y = cell.y*cHeight + (key === '-2' ? cHeight-wThickH:0);
               
                w.sx-w.ex === 0 ? y-=wThickH : x-=wThickW;
                for (let i = 0; i <= wallRatio+1; i++) {
                    context.drawImage(imgWall, x, y, wThickW + 0.5, wThickH + 0.5);
                    w.sx-w.ex === 0 ? y+=wThickH : x+=wThickW;
                }
            }
        };

        function getWallCoord(cell) {
            let coords = {
                '2':{sx:0, sy:0, ex:1, ey:0},
                '-1':{sx:1, sy:0, ex:1, ey:1},
                '-2':{sx:1, sy:1, ex:0, ey:1},
                '1':{sx:0, sy:1, ex:0, ey:0},
            };
            for (let adj of cell.children.concat(cell.parent)) {
                let x = cell.x - adj?.x;
                let y = cell.y - adj?.y;
                delete coords[x+2*y]
            }
            return coords;
        };

        function RenderPaths() {
            context.beginPath();
            for (let row = 0; row < size; row++) {
                for (let col = 0; col < size; col++) {
                    drawLines(maze[row][col]);
                }
            }
            context.closePath();
            context.strokeStyle = 'rgb(255, 255, 255)';
            context.lineWidth = 6;
            context.stroke();
        };

        function drawLines(cell) {
            for (let adj of cell.children.concat(cell.parent)) {
                context.moveTo((cell.x+0.5)*cWidth, (cell.y+0.5)*cHeight);
                context.lineTo((adj?.x+0.5)*cWidth, (adj?.y+0.5)*cHeight);
            }
        };

        function RenderSolution(solution) {
            context.beginPath();
            for (let i = 0; i < solution.length-1; i++) {
                context.moveTo((solution[i].x+0.5)*cWidth, (solution[i].y+0.5)*cHeight);
                context.lineTo((solution[i+1].x+0.5)*cWidth, (solution[i+1].y+0.5)*cHeight);
            };
            context.closePath();
            context.strokeStyle = 'rgb(0, 255, 255)';
            context.lineWidth = 6;
            context.stroke();
        };

        return {
            Render : Render,
            RenderPaths : RenderPaths,
            RenderSolution : RenderSolution,
        };
    };

    return {
        clear : clear,
        MazeRenderer : MazeRenderer,
    };
};
