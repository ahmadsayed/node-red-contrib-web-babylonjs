var util = require('./util');
var transformation = require("./transformation");

module.exports = function Shape(config, RED, componentType) {
    RED.nodes.createNode(this, config);
    this.scene = RED.nodes.getNode(config.scene);
    var params = util.getParameters(config);
    this.scene.context().get("object").push({ 'type': componentType, 'name': params.name, 'param': params });
    var node = this;
    node.on('input', function (msg, send, done) {
        msg.payload.name = params.name;
        transformation.queue.push(msg.payload);
        done();
    });

    let interval = setInterval(function() {
        if(transformation.eventQueue.length > 0) {                
            transformation.eventQueue.forEach(function(item) {
                console.log(item);
                node.send(item);
            });
            transformation.eventQueue.length = 0;
        }
    }, 50); 
}
