const { nextTick } = require("process");

module.exports = function (RED) {
    var ws = require("ws");
    var path = require("path");
    var express = require("express");
    var transformation = require("./transformation");

    function SceneNode(n) {
        RED.nodes.createNode(this, n);
        this.name = n.name;
        n.wss = new ws.Server({ noServer: true });


        this.sceneObjects = [];
        var context = this.context();
        // To serve the view pages
        RED.httpNode.use("/scene", express.static(__dirname + '/scene-ui'));
        context.set("object", []);
        context.set("overlay", n.overlay);
        // To serve rest service that provide the html with the list of component
        RED.httpNode.use("/sceneServe", function (req, res) {
            resp = {
                'overlay': context.get("overlay"),
                objects: context.get("object")
            }
            res.send(resp);

        });


        //TODO: Do not close websocket server, for some not yet unexplained behavior in 
        // WS library, when reload screen after deploy  the node-red crash
        // reload alone works fine, deploy alone works fine, deploy after reload works fine
        this.on('close', function (removed, done) {
            context.set("object", []);
            done();
            /*
            n.wss.close( () => {
                context.set("object", []);
                n.closed = true;
                done();
            });*/

        })
        transformation.initConnection(RED.server, n.wss);
        transformation.dispatchTransformation(n.wss);


        transformation.queue.push({ "type": "reload" });

    }
    RED.nodes.registerType("scene", SceneNode);
}