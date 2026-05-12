const messageschema=require('../schema/message');

const message=(io,socket)=>{
    try {
        io.on('connection',(socket)=>{

            socket.on('join-chat-room',(roomId)=>{
                socket.join(roomId);
                console.log(roomId);
                
                console.log('joined room:', roomId);
            });

        });
        socket.on('sendmessage',async(data)=>{
            const storemessage=await messageschema.create({
                roomId:data.roomId,
                senderId:data.senderId,
                content:data.content
            })
            
            io.to(data.roomId).emit('messagestorage',{
                storemessage,
                message:"message stored successfull"
            })
        })
    } catch (error) {
        return socket.emit('messagestorage',{
            message:error.message
        })
    }
}
module.exports=message