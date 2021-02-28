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
    let maze;
    let wallRatio;
    let size;
    let cLength;
    let wThick;

    CanvasRenderingContext2D.prototype.clear = function() {
        this.save();
        this.setTransform(1, 0, 0, 1, 0, 0);
        this.clearRect(0, 0, canvas.width, canvas.height);
        this.restore();
    };
    function clear() {
        context.clear();
    }

    function InitRenderer(spec) {
        maze = spec.maze.GetMaze();
        wallRatio = spec.wallRatio ?? 10;
        size = spec.maze.GetSize();
        cLength = Math.min(canvas.width, canvas.height)/size;
        wThick = cLength/wallRatio;
    }

    function UpdateRenderer(spec) {
        maze = spec.maze.GetMaze();
        size = spec.maze.GetSize();
        cLength = Math.min(canvas.width, canvas.height)/size;
        wThick = cLength/wallRatio;
    }

    function RenderScore(score) {
        let milSec = Math.floor((score.time%1000)/100);
        let seconds = Math.floor(score.time/1000)%60;
        let mins = Math.floor(score.time/60000);
        document.getElementById('time').innerHTML = `${mins}:${seconds}:${milSec}`;
        document.getElementById('score').innerHTML = `${score.points}`;
        document.getElementById('score-size').innerHTML = `FOR ${size}X${size}`;
        if (score.gameOver) {
            context.fillStyle = 'rgba(0,0,0,.7)';
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.font = "30px Comic Sans MS";
            context.fillStyle = "rgba(252, 57, 3,1)";
            context.textAlign = "center";
            context.fillText("Game Over", canvas.width/2, canvas.height/2.5);
            context.fillText(`Score: ${score.points}`, canvas.width/2, canvas.height/2);
        };
        let highList = document.getElementById('highscores');
        highList.innerHTML = "";
        for (let i=0; i<5; i++) {
            let text = 'None';
            if (score.highscores[size][i] != undefined) {
                text = score.highscores[size][i];
            }
            score
            let e = document.createElement('li');
            e.appendChild(document.createTextNode(text));
            highList.appendChild(e);
        }
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
                        cell.x * cLength, cell.y * cLength,
                        cLength + 0.5, cLength + 0.5
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
            let x = cell.x*cLength;

            let y = cell.y*cLength;

            let grd = context.createLinearGradient(
                    x+(cLength*openEdge.ey), y+(cLength*openEdge.sx), 
                    x+(cLength*openEdge.sy), y+(cLength*openEdge.ex), 
                );
            grd.addColorStop(0, "rgba(0,0,0,0)");
            grd.addColorStop(1, color);
            context.fillStyle = grd;
            context.fillRect(x, y, cLength, cLength);
            
            //SAVE FOR PATH HELP DRAWING MAYBE
            //let grd = context.createRadialGradient(x,y,cLength/5,x,y,cLength1.5);
            //grd.addColorStop(0, color);
            //grd.addColorStop(1, "rgba(0,0,0,0)");
            //context.beginPath();
            //context.moveTo(x, y);
            //context.arc(x, y, cLength/1.5, 0, Math.PI/2);
            //context.fillStyle = grd;
            //context.fill();
        }

        function drawWall(cell) {
            let walls = getWallCoord(cell);

            for (let [key, w] of Object.entries(walls)) {

                let x = cell.x*cLength+ (key === '-1' ? cLength-wThick:0);
                let y = cell.y*cLength + (key === '-2' ? cLength-wThick:0);
               
                w.sx-w.ex === 0 ? y-=wThick : x-=wThick;
                for (let i = 0; i <= wallRatio+1; i++) {
                    context.drawImage(imgWall, x, y, wThick + 0.5, wThick + 0.5);
                    w.sx-w.ex === 0 ? y+=wThick : x+=wThick;
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
                context.moveTo((cell.x+0.5)*cLength (cell.y+0.5)*cLength);
                context.lineTo((adj?.x+0.5)*cLength, (adj?.y+0.5)*cLength);
            }
        };

        function RenderSolution(solution) {
            context.beginPath();
            for (let cell of solution) {
                let x = (cell.x+0.5)*cLength;
                let y = (cell.y+0.5)*cLength;
                let radius = ((cLength - 2*wThick)/2);
                let grd = context.createRadialGradient(x,y,0,x,y,radius);
                grd.addColorStop(0, "rgba(0,0,0,0)");
                grd.addColorStop(.3, "rgba(0,0,0,0)");
                grd.addColorStop(.7, "rgba(250, 250, 50, 1)");
                grd.addColorStop(1, "rgba(0,0,0,0)");
                context.moveTo(x, y);
                context.arc(x, y, radius, 0, 2*Math.PI);
                context.fillStyle = grd;
                context.fill();
            }
            context.closePath();
        };

        return {
            Render : Render,
            RenderPaths : RenderPaths,
            RenderSolution : RenderSolution,
        };
    };

    function CharacterRenderer(spec) {
        let character = spec.character;
        let Render = function() {
            let x = (character.x + 0.5)*cLength;
            let y = (character.y + 0.5)*cLength;
            let radius = ((cLength - 2*wThick)/2)*0.8;
            let offset = radius/2;
            let grd = context.createRadialGradient(
                x+offset,y-offset,0,
                x+offset,y-offset,radius+offset
            );
            grd.addColorStop(0, "rgba(255,255,255,1)");
            grd.addColorStop(1, "rgba(0,55,55,1)");
            context.beginPath();
            context.moveTo(x, y);
            context.arc(x, y, radius, 0, 2*Math.PI);
            context.fillStyle = grd;
            context.fill();
            context.closePath();
        };

        let RenderCrumbs = function() {
            context.beginPath();
            for (let cell of character.tracks) {
                if (cell.x != character.x || cell.y != character.y) {
                    let x = (cell.x+0.5)*cLength;
                    let y = (cell.y+0.5)*cLength;
                    let radius = ((cLength - 2*wThick)/2)*0.3;
                    let offset = radius/2;
                    let grd = context.createRadialGradient(
                        x+offset,y-offset,0,
                        x+offset,y-offset,radius+offset
                    );
                    context.moveTo(x, y);
                    context.arc(x, y, radius, 0, 2*Math.PI);
                };
            };
            context.fillStyle = 'rgba(171, 148, 58,1)';
            context.fill();
            context.closePath();
        };

        return {
            Render : Render,
            RenderCrumbs : RenderCrumbs,
        };
    };

    return {
        clear : clear,
        InitRenderer : InitRenderer,
        UpdateRenderer : UpdateRenderer,
        MazeRenderer : MazeRenderer,
        CharacterRenderer : CharacterRenderer,
        RenderScore : RenderScore,
    }; 
};
