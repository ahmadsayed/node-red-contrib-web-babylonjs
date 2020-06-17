module.exports = function(RED) {
    function TransformNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        node.on('input', function(msg) {
            msg.payload = 
            {
                "type": config.name,
                "relative": config.relative,
                "values":  {
                    x: config.xaxis != "" ? config.xaxis : msg.payload.x,
                    y: config.yaxis != "" ? config.yaxis : msg.payload.y,
                    z: config.zaxis != "" ? config.zaxis : msg.payload.z

                }
            };
            node.send(msg);
        });
    }
    RED.nodes.registerType("transform",TransformNode);
}