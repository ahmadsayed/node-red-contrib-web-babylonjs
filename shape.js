var util = require('./util');
var transformation = require("./transformation");

module.exports = function Shape(config, RED, componentType) {
    RED.nodes.createNode(this, config);
    this.scene = RED.nodes.getNode(config.scene);
    this.material = RED.nodes.getNode(config.material);
    var params = util.getParameters(config);
    this.scene.context().get("object").push(
        {
            'type': componentType,
            'name': params.name,
            'param': params,
            'position': {
                x: config.pos_x,
                y: config.pos_y,
                z: config.pos_z,
            },
            'scaling': {
                x: config.scale_x,
                y: config.scale_y,
                z: config.scale_z,
            },
            'rotation': {
                x: (Number(config.rot_x) * Math.PI) / 180,
                y: (Number(config.rot_y) * Math.PI) / 180,
                z: (Number(config.rot_z) * Math.PI) / 180,
            },
            'material': {
                name: this.material.name,
                diffuse: this.material.diffuse,
                specular: this.material.specular,
                alpha: parseFloat(this.material.alpha),
            }
        }
    );
    var node = this;
    node.on('input', function (msg, send, done) {
        msg.payload.name = params.name;
        transformation.emitter.emit("transform", msg.payload);
        done();
    });

    transformation.emitter.on("click-pick", (evt) => {
        if (evt.name == params.name) {
            node.send(evt);
        }
    });
}
