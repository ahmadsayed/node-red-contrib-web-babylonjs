module.exports = function (RED) {
    function TransformNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.on('input', function (msg, send, done) {
            if (config.name == "rotate") {
                msg.payload =
                {
                    "type": config.name,
                    "relative": config.relative,
                    "values": {
                        x: config.xaxis != "" ? ((Number(config.xaxis) * Math.PI)/180) : msg.payload.x,
                        y: config.yaxis != "" ? ((Number(config.yaxis) * Math.PI)/180) : msg.payload.y,
                        z: config.zaxis != "" ? ((Number(config.zaxis) * Math.PI)/180) : msg.payload.z

                    }
                };
            } else {
                msg.payload =
                {
                    "type": config.name,
                    "relative": config.relative,
                    "values": {
                        x: config.xaxis != "" ? Number(config.xaxis) : msg.payload.x,
                        y: config.yaxis != "" ? Number(config.yaxis) : msg.payload.y,
                        z: config.zaxis != "" ? Number(config.zaxis) : msg.payload.z

                    }
                };
            }
            send(msg);
            done();
        });
    }
    RED.nodes.registerType("transform", TransformNode);
}