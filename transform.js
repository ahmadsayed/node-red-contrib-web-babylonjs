module.exports = function(RED) {
    function TransformNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            msg.payload = 
            {
                "type": config.name,
                "values": msg.payload
            };
            node.send(msg);
        });
    }
    RED.nodes.registerType("transform",TransformNode);
}