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

        let size = spec.maze.GetSize();
        let maze = spec.maze.GetMaze();
        function Render() {
            // Render the cells first
            context.beginPath();
            for (let row = 0; row < size; row++) {
                for (let col = 0; col < size; col++) {
                    drawCell(maze[row][col]);
                }
            }
            context.closePath();
            context.strokeStyle = 'rgb(255, 255, 255)';
            context.lineWidth = 6;
            context.stroke();

            // Draw a black border around the whole maze
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(canvas.width - 1, 0);
            context.lineTo(canvas.width - 1, canvas.height - 1);
            context.lineTo(0, canvas.height - 1);
            context.closePath();
            context.strokeStyle = 'rgb(0, 0, 0)';
            context.stroke();
        };

        function drawCell(cell) {
        
            if (imgFloor.isReady) {
                context.drawImage(imgFloor,
                cell.x * (canvas.width / size), cell.y * (canvas.height / size),
                canvas.width / size + 0.5, canvas.height / size + 0.5);
            };

            let walls = getWallCoord(cell);

            for (let [key, w] of Object.entries(walls)) {
                context.moveTo((cell.x + w.sx) * (canvas.width / size), (cell.y + w.sy) * (canvas.height / size));
                context.lineTo((cell.x + w.ex) * (canvas.width / size), (cell.y + w.sx) * (canvas.height / size));
            }
            context.stroke();
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

        return {
            Render : Render,
        };
    };

    function Texture(spec) {
        let that = {};
        let ready = false;
        let image = new Image();

        image.onload = function() { 
            ready = true;
        };
        image.src = spec.image;

        that.rotateRight = function(elapsedTime) {
            spec.rotation += spec.rotateRate * (elapsedTime / 1000);
        };

        that.rotateLeft = function(elapsedTime) {
            spec.rotation -= spec.rotateRate * (elapsedTime / 1000);
        };

        that.moveLeft = function(elapsedTime) {
            spec.center.x -= spec.moveRate * (elapsedTime / 1000);
        };

        that.moveRight = function(elapsedTime) {
            spec.center.x += spec.moveRate * (elapsedTime / 1000);
        };
        
        that.moveUp = function(elapsedTime) {
            spec.center.y -= spec.moveRate * (elapsedTime / 1000);
        };
        
        that.moveDown = function(elapsedTime) {
            spec.center.y += spec.moveRate * (elapsedTime / 1000);
        };

        that.draw = function() {
            if (ready) {
                context.save();
                
                context.translate(spec.center.x, spec.center.y);
                context.rotate(spec.rotation);
                context.translate(-spec.center.x, -spec.center.y);
                
                context.drawImage(
                    image, 
                    spec.center.x - spec.width/2, 
                    spec.center.y - spec.height/2,
                    spec.width, spec.height);
                
                context.restore();
            }
        };

        return that;
    }

    return {
        clear : clear,
        Texture : Texture,
        MazeRenderer : MazeRenderer,
    };
};
