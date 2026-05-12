const chatsocket=require('./chatsocket');
const message = require('./message');
const roomsocket=require('./room');
const socketsetup=(io)=>{
    io.on('connection',(socket)=>{
        console.log('connection established');
        
        chatsocket(io,socket);
        roomsocket(io,socket);
        message(io,socket);
    });
}
module.exports=socketsetup;