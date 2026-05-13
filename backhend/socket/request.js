const message = require('../schema/message');
const requestschema=require('../schema/request');
const requestsocket=(io,socket)=>{
    socket.on('sendrequest',async(data)=>{
        console.log((data));
        if(!data)
        {
            return socket.emit('sendrequest-response',{
                message:"request data is empty"
            })
        }

        const storerequest=await requestschema.create({
            senderId:data.id,
            senderName:data.user,
            receiverId:data.friend._id
        })

        return socket.emit('sendrequest-response',storerequest);
    })
}
module.exports=requestsocket;