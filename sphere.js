module.exports = function(RED) {
    let server = RED.server;
    var util = require('./util');
    var componentType = 'sphere';
    const WebSocket = require('ws');
    const wss = new WebSocket.Server({ server });
    
    function SphereNode(config) {
        RED.nodes.createNode(this,config);
        this.scene = RED.nodes.getNode(config.scene);
        this.scene.context().get("object").push({'type' : componentType , 'name': config.name, 'param':util.getParameters(config)});
        var node = this;
        node.on('input', function(msg) {
            //msg.payload = msg.payload.toLowerCase();
            console.log(msg.payload);
//          node.send(msg);
        });
    }

    RED.nodes.registerType(componentType,SphereNode);
}