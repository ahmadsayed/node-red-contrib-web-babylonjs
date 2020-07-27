module.exports = function (RED) {
    var ws = require("ws");
    var path = require("path");
    var express = require("express");
    var transformation = require("./transformation");
    function SceneNode(n) {
        RED.nodes.createNode(this, n);
        this.name = n.name;
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

    
        this.on('close', function (removed, done) {
            transformation.terminateConnection(() => {
                context.set("object", []);
                done();
            });


        })

        transformation.dispatchTransformation(RED.server);

        transformation.queue.push({"type": "reload"});
        
    }
    RED.nodes.registerType("scene", SceneNode);
}