module.exports = function(RED) {

    function BoxNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        this.scene = RED.nodes.getNode(config.scene);
        console.log(config.name);
        this.scene.sceneObjects.push({'type' : 'box', 'name' : config.name});
        node.on('input', function(msg) {
            msg.payload = msg.payload.toLowerCase();
//          node.send(msg);
        });
    }
    RED.nodes.registerType("box",BoxNode);
}