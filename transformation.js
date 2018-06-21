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
                    console.log(item);
                    wss.send(item);
                });
                // no need to clear the array just reset the index
                queue.length = 0;
            }
        }, 100);        
    });  
}

function terminateConnection (cb) {
    console.log('Terminate');
    wss.close( cb) ;
}
module.exports =  {
    dispatchTransformation, 
    terminateConnection,
    get queue () {return queue;}
}; 