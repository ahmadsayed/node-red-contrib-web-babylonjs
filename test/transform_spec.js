var should = require("should");
var helper = require("node-red-node-test-helper");
var transformNode = require("../transform.js");
var sphereNode = require("../sphere.js");


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
  
});
