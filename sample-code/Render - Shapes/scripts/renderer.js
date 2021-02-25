let Graphics = (function() {
    let canvas = document.getElementById('id-canvas');
    let context = canvas.getContext('2d');
    
    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    function drawTriangle(spec) {
        context.save();
    
        context.translate(spec.center.x, spec.center.y);
        context.rotate(spec.rotation);
        context.translate(-spec.center.x, -spec.center.y);
    
        context.beginPath();
        context.moveTo(spec.pt1.x, spec.pt1.y);
        context.lineTo(spec.pt2.x, spec.pt2.y);
        context.lineTo(spec.pt3.x, spec.pt3.y);
        context.closePath();
    
        context.fillStyle = spec.fillStyle;
        context.fill();
    
        context.strokeStyle = spec.strokeStyle;
        context.stroke();
    
        context.restore();
    }
    
    function drawRectangle(spec) {
        context.save();
    
        context.translate(
            spec.x + spec.width / 2,
            spec.y + spec.height / 2);
        context.rotate(spec.rotation);
        context.translate(
            -(spec.x + spec.width / 2),
            -(spec.y + spec.height / 2));
    
        context.fillStyle = spec.fillStyle;
        context.fillRect(spec.x, spec.y, spec.width, spec.height);
    
        context.strokeStyle = spec.strokeStyle;
        context.strokeRect(spec.x, spec.y, spec.width, spec.height);
    
        context.restore();
    }

    function drawTexture(texture) {
        if (texture.ready) {
            context.save();
            context.translate(texture.center.x, texture.center.y);
            context.rotate(texture.rotation);
            context.translate(-texture.center.x, -texture.center.y);

            context.drawImage(
                texture.image,
                texture.center.x - texture.width/2,
                texture.center.y - texture.height/2,
                texture.width, texture.height);

             context.restore();
        }
    }

    return {
        drawRectangle: drawRectangle,
        drawTriangle: drawTriangle,
        drawTexture: drawTexture,
        clear: clear
    };
})();
