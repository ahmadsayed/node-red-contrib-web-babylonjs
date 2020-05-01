module.exports = function (RED) {
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
        // To serve rest service that provide the html with the list of component
        RED.httpNode.use("/sceneServe", function (req, res) {
            console.log("Request Resources");
            res.send(context.get("object"));
        });
        this.on('close', function (removed, done) {
            console.log("Terminate Connection");
            transformation.terminateConnection(() => {
                context.set("object", []);
                done();
            });


        })
        console.log("Dispatch Transformation");
        transformation.dispatchTransformation({ port: 9099 });

        transformation.queue.push({"type": "reload"});
        
    }
    RED.nodes.registerType("scene", SceneNode);
}