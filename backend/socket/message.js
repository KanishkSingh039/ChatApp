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
            let storemessage;
            if(data.category==='file'){
                 storemessage=await messageschema.create({
                    roomId:data.roomId,
                    senderId:data.senderId,
                    content:data.url,
                    category:data.category
                })
            }
            else{
                 storemessage=await messageschema.create({
                    roomId:data.roomId,
                    senderId:data.senderId,
                    content:data.content,
                    category:'text'
                })

            }
            
            io.to(data.roomId).emit('messagestorage',{
                storemessage,
                message:"message stored successfull"
            })
        })
        socket.on('delete-message',async(_id)=>{
            const findmessageanddelete=await messageschema.findByIdAndDelete({_id});
            io.to(findmessageanddelete.roomId).emit('update-chatroom',({id:_id}));
        })
        
    } catch (error) {
        return socket.emit('messagestorage',{
            message:error.message
        })
    }
}
module.exports=message