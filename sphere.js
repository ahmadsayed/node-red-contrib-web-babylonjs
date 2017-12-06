
module.exports = function(RED) {
    var util = require('./util');
    var componentType = 'sphere';
    function SphereNode(config) {
        RED.nodes.createNode(this,config);
        this.scene = RED.nodes.getNode(config.scene);
        this.scene.context().get("object").push({'type' : componentType , 'name': config.name, 'param':getParameters(config)});
        var node = this;
        node.on('input', function(msg) {
            msg.payload = msg.payload.toLowerCase();
//          node.send(msg);
        });
    }
    function getParameters(config) {
        console.log(config);
        var param = {
            'diameter': Number(config.diameter), 
            'segments': Number(config.segments), 
            'diameterX': config.diameterX,
            'diameterY': config.diameterY,
            'diameterZ': config.diameterZ,
            'arc': Number(config.arc),
            'slice': Number(config.slice),
            'updatable': config.updatable,
            'sideOrientation': config.sideOrientation

        }
        console.log(param);
        return param;
    }
    RED.nodes.registerType(componentType,SphereNode);
}