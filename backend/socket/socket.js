const chatsocket=require('./chatsocket');
const message = require('./message');
const requestsocket = require('./request');
const roomsocket=require('./room');
const call=require('./call');
const connectedClients = new Map();

const socketsetup=(io)=>{
    io.on('connection',(socket)=>{
        connectedClients.set(socket.id, socket);
        console.log(`Connected: ${connectedClients.size} clients`);
        chatsocket(io,socket);
        roomsocket(io,socket);
        message(io,socket);
        call(io,socket);
        requestsocket(io,socket);
        console.log('Total listeners:', socket.eventNames().length);
        console.log('Events:', socket.eventNames());
        socket.on('disconnect', () => {
        connectedClients.delete(socket.id);
        console.log(`Disconnected: ${connectedClients.size} clients`);
        socket.removeAllListeners();
    });
    
    });
}
module.exports=socketsetup;