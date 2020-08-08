//TODO : Rename this module to be Event manager instead of transformation shit

const WebSocket = require('ws');
const url = require('url');
const events = require('events');

//TODO: Replace all this shit (queues, busy wait pulling, bla bla ) with Node.JS Events
var queue = [];
// event Queue for shape interaction (Pick, Drag, ....) only Pick is implemented
var eventQueue = []; 
// event Queue for scene Events  (Keyboard Event)
var sceneEventQueue = []; 

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
            if (message.type && message.type == 'click-pick') {
                eventQueue.push(message);
            } else {
                sceneEventQueue.push(message);

            }

        });
        // Handle Error to avoid crash
        ws.on('error', (error) => {
            console.debug(error)
        });

        emitter.on("transform", (msg)=> {
            if (ws.readyState == WebSocket.OPEN) {
                ws.send(JSON.stringify(msg));
            }
        });
    });
}

function initConnection(server, wss) {

    // Multiple servers sharing a single HTTP/S server, server  is Node-Red Server coming from 
    // RED.server

    server.on('upgrade', function upgrade(request, socket, head) {
        const pathname = url.parse(request.url).pathname;

        if (pathname === '/ws-stream') {
            wss.handleUpgrade(request, socket, head, function done(ws) {
                 wss.emit('connection', ws, request);
            });

        } else {
            //Do not destroy the socket will stop node-red dashboard
            //socket.destroy();
        }
    });
}
function terminateConnection(cb) {
    if (wss != null) {
        wss.close(cb);
    }

}
module.exports = {
    dispatchTransformation,
    terminateConnection,
    initConnection,
    get queue() { return queue; },
    get eventQueue() { return eventQueue; },
    get emitter() { return emitter;}
}; 
