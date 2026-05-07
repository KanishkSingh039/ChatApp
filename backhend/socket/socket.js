const chatsocket=require('./chatsocket');
const socketsetup=(io)=>{
    io.on('connection',(socket)=>{
        console.log('connection established');
        
        chatsocket(io,socket);
    });
}
module.exports=socketsetup;