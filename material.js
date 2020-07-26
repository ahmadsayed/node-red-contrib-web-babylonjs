module.exports = function (RED) {

    // Thanks to : https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    // Modified to replace 1-255 with 0 - 1 Range
    function hexToRgb(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16)/255,
            g: parseInt(result[2], 16)/255,
            b: parseInt(result[3], 16)/255
        } : null;
    }

    function MaterialNode(n) {
        RED.nodes.createNode(this, n);
        this.name = n.name;
        this.diffuse = hexToRgb(n.diffuse);
        if (n.specular != null) {
            this.specular = hexToRgb(n.specular);
        }
        
        this.alpha = n.alpha;
        this.on('close', function (removed, done) {
            done();
        });

    }
    RED.nodes.registerType("material", MaterialNode);
}