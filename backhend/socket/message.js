const messageschema=require('../schema/message');

const message=(io,socket)=>{
    try {
        socket.on('sendmessage',async(data)=>{
            const storemessage=await messageschema.create({
                roomId:data.roomId,
                senderId:data.senderId,
                content:data.content
            })
            
            socket.emit('messagestorage',{
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