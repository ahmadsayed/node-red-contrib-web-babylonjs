var should = require("should");
var helper = require("node-red-node-test-helper");
var transformNode = require("../transform.js");


helper.init(require.resolve('node-red'));


describe('transform Node', function () {
    beforeEach(function (done) {
        helper.startServer(done);
    });

    afterEach(function (done) {
        helper.unload();
        helper.stopServer(done);

    });

    it('should be loaded', function (done) {
        var flow = [
            { id: "n1", type: "transform", name: "position" }
        ];
        helper.load(transformNode, flow, function () {
            var n1 = helper.getNode("n1");
            n1.should.have.property('name', 'position');
            done();
        });
    });

    it('should inject position', function (done) {
        var flow = [
            { id: "n1", type: "transform", name: "position", wires: [["n2"]] },
            { id: "n2", type: "helper" }
        ];
        helper.load(transformNode, flow, function () {
            var n2 = helper.getNode("n2");
            var n1 = helper.getNode("n1");
            n2.on("input", function (msg) {
                msg.should.have.property('payload',
                    {
                        "type": "position",
                        "values":
                            { "x": 2 }
                    }
                );
                done();
            });
            n1.receive({
                payload:
                    { "x": 2 }
            });
        });
    });


    it('should inject rotate', function (done) {
        var flow = [
            { id: "n1", type: "transform", name: "rotate", wires: [["n2"]] },
            { id: "n2", type: "helper" }
        ];
        helper.load(transformNode, flow, function () {
            var n2 = helper.getNode("n2");
            var n1 = helper.getNode("n1");
            n2.on("input", function (msg) {
                msg.should.have.property('payload',
                    {
                        "type": "rotate",
                        "values":
                            { "x": 2 }
                    }
                );
                done();
            });
            n1.receive({
                payload:
                    { "x": 2 }
            });
        });
    });    
});
