const chatsocket=(io,socket)=>{
    socket.on('currentmessage',(data)=>{
        console.log(data);
        
        io.emit('chat',data)
    });
}
module.exports=chatsocket;