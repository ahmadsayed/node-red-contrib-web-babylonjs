//TODO : Rename this module to be Event manager instead of transformation shit

//const WebSocket = require('ws');
var ws = require("ws");

const url = require('url');
const events = require('events');
const { emitWarning } = require('process');

var emitter = new events.EventEmitter();
/**
 * 
 * @param {*} server 
 */
function dispatchTransformation(wss) {
    // This variable used to check the number of consumed message

    consumed_messages = 0;
    wss.on('connection', function (ws, req) {
        ws.on('message', function (message) {
            evt = JSON.parse(message);
            if (evt.type) {
                emitter.emit(evt.type, evt);
            }
        });
        // Handle Error to avoid crash
        ws.on('error', (error) => {
            console.debug(error)
        });

        emitter.on("transform", (msg) => {
            if (ws.readyState == ws.OPEN) {
                ws.send(JSON.stringify(msg));
            }
        });

        emitter.on("reload", () => {
            if (ws.readyState == ws.OPEN) {
                ws.send(JSON.stringify({
                    type: "reload"
                }));
            }

        });
    });
}

var wss = null;
var serverUpgradeAdded = false
function initConnection(server) {

    // Multiple servers sharing a single HTTP/S server, server  is Node-Red Server coming from
    // RED.server
    wss = new ws.Server({ noServer: true });
    if (!serverUpgradeAdded) {
        server.on('upgrade', function upgrade(request, socket, head) {
            const pathname = url.parse(request.url).pathname;
                if (pathname === '/ws-stream' && wss != null) {
                    wss.handleUpgrade(request, socket, head, function done(ws) {
                        wss.emit('connection', ws, request);
                    });


            } else {
                //Do not destroy the socket will stop node-red dashboard
                //socket.destroy();
            }
        });
        serverUpgradeAdded = true;
    }
    dispatchTransformation(wss);
}
function terminateConnection(cb) {
    if (wss != null) {
        wss.close(cb);
        wss = null;
    }

}
module.exports = {
    dispatchTransformation,
    terminateConnection,
    initConnection,
    get emitter() { return emitter; }
}; 
