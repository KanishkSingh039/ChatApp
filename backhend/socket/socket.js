const chatsocket=require('./chatsocket');
const roomsocket=require('./room');
const socketsetup=(io)=>{
    io.on('connection',(socket)=>{
        console.log('connection established');
        
        chatsocket(io,socket);
        roomsocket(io,socket);
    });
}
module.exports=socketsetup;