module.exports = function(RED) {
    let server = RED.server;
    var util = require('./util');
    var transformation = require("./transformation");

    var componentType = 'sphere';
    
    function SphereNode(config) {
        RED.nodes.createNode(this,config);
        this.scene = RED.nodes.getNode(config.scene);
        var params = util.getParameters(config);
        this.scene.context().get("object").push({'type' : componentType , 'name': params.name, 'param':params});
        var node = this;
        node.on('input', function(msg) {
            msg.payload.name = params.name;
            transformation.queue.push(msg.payload);
        });
    }

    RED.nodes.registerType(componentType,SphereNode);
}