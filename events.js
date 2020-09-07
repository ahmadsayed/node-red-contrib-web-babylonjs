var transformation = require("./transformation");

module.exports = function (RED) {
    function EventsNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        transformation.emitter.on("keydown", (evt) => {
            node.send(evt);
        });
        transformation.emitter.on("keyup", (evt) => {
            node.send(evt);
        });
    }
    RED.nodes.registerType("events", EventsNode);
}