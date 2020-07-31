module.exports = function (RED) {
    function TransformNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        //TODO: Check the best practice who should take precedence the information coming from payload
        // Or the information in config.
        // Current approach of config left empty use the payload.

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
            msg.payload.pivot = {
                x: config.pivot_x != "" ? config.pivot_x : msg.payload.pivot_x,
                y: config.pivot_y != "" ? config.pivot_y : msg.payload.pivot_y,
                z: config.pivot_z != "" ? config.pivot_z : msg.payload.pivote_z
            }
            send(msg);
            done();
        });
    }
    RED.nodes.registerType("transform", TransformNode);
}