const WebSocket = require('ws');
var queue = [];
/**
 * 
 * @param {*} server 
 */
function dispatchTransformation (server) {
    const wss = new WebSocket.Server( server );
    wss.on('connection', function(ws, req) {
        ws.on('message', function(message) {
            console.log(message);
        });
        let interval = setInterval(function() {
            ws.send("Hello World");
            if(queue.length > 0) {
                queue.forEach(function(item) {
                    wss.send(item);
                });
                // no need to clear the array just reset the index
                queue.length = 0;
            }
        }, 100);        
    });  
}
module.exports =  {
    dispatchTransformation, 
    get queue () {return queue;}
}; 