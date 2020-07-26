var util = require('./util');
var transformation = require("./transformation");

module.exports = function Shape(config, RED, componentType) {
    RED.nodes.createNode(this, config);
    this.scene = RED.nodes.getNode(config.scene);
    this.material = RED.nodes.getNode(config.material);
    var params = util.getParameters(config);

    this.scene.context().get("object").push(
        { 
            'type': componentType, 
            'name': params.name, 
            'param': params,
            'material' : {
                name: this.material.name,
                diffuse: this.material.diffuse,
                specular: this.material.specular,
                alpha: parseFloat(this.material.alpha),
            }
        }
    );
    var node = this;
    node.on('input', function (msg, send, done) {
        msg.payload.name = params.name;
        transformation.queue.push(msg.payload);
        done();
    });

    let interval = setInterval(function () {
        if (transformation.eventQueue.length > 0) {
            transformation.eventQueue.forEach(function (item) {
                picked = JSON.parse(item);
                if (picked.name === params.name) {
                    node.send(picked);
                    
                }

            });
            transformation.eventQueue.length = 0;
        }
    }, 50);
}
