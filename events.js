module.exports = function (RED) {
    function EventsNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
           node.on('input', function (msg, send, done) {
            send(msg);
            done();
        });
    }
    RED.nodes.registerType("events", EventsNode);
}