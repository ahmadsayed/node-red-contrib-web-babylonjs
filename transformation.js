const WebSocket = require('ws');
var wss ;
var queue = [];
/**
 * 
 * @param {*} server 
 */
function dispatchTransformation (server) {
    wss = new WebSocket.Server( server );
    wss.on('connection', function(ws, req) {
        ws.on('message', function(message) {
            console.log(message);
        });
        let interval = setInterval(function() {
            if(queue.length > 0) {
                queue.forEach(function(item) {
                    if (ws.readyState === WebSocket.OPEN) {
                        console.log(item);
                        ws.send(JSON.stringify(item));
                    }
                });
                // no need to clear the array just reset the index
                queue.length = 0;
            }
        }, 100);        
    });  
}

function terminateConnection (cb) {
    wss.close( cb) ;
}
module.exports =  {
    dispatchTransformation, 
    terminateConnection,
    get queue () {return queue;}
}; 