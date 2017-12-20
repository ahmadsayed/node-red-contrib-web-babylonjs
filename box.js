module.exports = function(RED) {
    var util = require('./util');
    var componentType = 'box';
    function SphereNode(config) {
        RED.nodes.createNode(this,config);
        this.scene = RED.nodes.getNode(config.scene);
        this.scene.context().get("object").push({'type' : componentType , 'name': config.name, 'param':util.getParameters(config)});
        var node = this;
        node.on('input', function(msg) {
            msg.payload = msg.payload.toLowerCase();
        });
    }

    RED.nodes.registerType(componentType,SphereNode);
}