const WebSocket = require('ws');
var wss ;
var queue = [];
/**
 * 
 * @param {*} server 
 */
function dispatchTransformation (server) {
    // This variable used to check the number of consumed message
    consumed_messages = 0;
    wss = new WebSocket.Server( server );
    wss.on('connection', function(ws, req) {
        ws.on('message', function(message) {
            console.log(message);
        });
        ws.on('error', (error) => {
            // Handle Error to avoid crash
            console.debug(error)});
        let interval = setInterval(function() {
            if(queue.length > 0) {                
                queue.forEach(function(item) {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify(item));
                        //increment number of consumed message
                        consumed_messages+=1;
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
