module.exports = function(RED) {
    var util = require('./util');
    var transformation = require("./transformation");
    var shape  = require("./shape.js");

    var componentType = '3D Cone';
    function GroundNode(config) {
        shape.call(this, config, RED, componentType);
    }

    RED.nodes.registerType(componentType,GroundNode);
}
