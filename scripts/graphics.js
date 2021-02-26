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
        const coords = {
            '2':{sx:0, sy:0, ex:1, ey:0},
            '-1':{sx:1, sy:0, ex:1, ey:1},
            '-2':{sx:1, sy:1, ex:0, ey:1},
            '1':{sx:0, sy:1, ex:0, ey:0},
        };

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
                        cWidth + 0.5, cHeight + 0.5
                    );
                if (cell.isStart) {
                    boxLightSquare(cell, 'rgba(98, 255, 84, 1)');
                }
                if (cell.isEnd) {
                    boxLightSquare(cell, 'rgba(250, 250, 50, 1)');
                }
            };
        };

        function boxLightSquare(cell, color) {
            let adj = cell.parent ?? cell.children[0];
            let openEdge = coords[(cell.x-adj.x)+2*(cell.y-adj.y)];
            let x = cell.x*cWidth;
            let y = cell.y*cHeight;

            let grd = context.createLinearGradient(
                    x+(cHeight*openEdge.ey), y+(cWidth*openEdge.sx), 
                    x+(cHeight*openEdge.sy), y+(cWidth*openEdge.ex), 
                );
            grd.addColorStop(0, "rgba(0,0,0,0)");
            grd.addColorStop(1, color);
            context.fillStyle = grd;
            context.fillRect(x, y, cWidth, cHeight);
            
            //SAVE FOR PATH HELP DRAWING MAYBE
            //let grd = context.createRadialGradient(x,y,cWidth/5,x,y,cWidth/1.5);
            //grd.addColorStop(0, color);
            //grd.addColorStop(1, "rgba(0,0,0,0)");
            //context.beginPath();
            //context.moveTo(x, y);
            //context.arc(x, y, cWidth/1.5, 0, Math.PI/2);
            //context.fillStyle = grd;
            //context.fill();
        }

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
            let wallCoords = JSON.parse(JSON.stringify(coords));
            for (let adj of cell.children.concat(cell.parent)) {
                let x = cell.x - adj?.x;
                let y = cell.y - adj?.y;
                delete wallCoords[x+2*y]
            }
            return wallCoords;
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
