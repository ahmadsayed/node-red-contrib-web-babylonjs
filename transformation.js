const WebSocket = require('ws');
const url = require('url');

var queue = [];
var eventQueue = [];
var upgraded = false;
/**
 * 
 * @param {*} server 
 */
function dispatchTransformation(wss) {
    // This variable used to check the number of consumed message

    consumed_messages = 0;
    wss.on('connection', function (ws, req) {
        ws.on('message', function (message) {
            eventQueue.push(message);
        });
        // Handle Error to avoid crash
        ws.on('error', (error) => {
            console.debug(error)
        });
        let interval = setInterval(function () {
            if (queue.length > 0) {
                queue.forEach(function (item) {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify(item));
                        //increment number of consumed message
                        consumed_messages += 1;
                    }
                });
                // decrease the length of queue by the number
                // of consumed messages
                // This logic is introduced to handle the cases 
                // when ws.readState not OPEN, the messages skipped
                // with this logic insure it will be processed 
                // in the next interation after connection reset
                queue.length = queue.length - consumed_messages;
                consumed_messages = 0;
            }
        }, 50);
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
    get eventQueue() { return eventQueue; }
}; 
