const user=require('../schema/user');
const room=require('../schema/room');
const { verify } = require('jsonwebtoken');
const message = require('../schema/message');
const roomsocket=(io,socket)=>{
    socket.on('createroom',async(data)=>{
        const finduser=await user.findOne({name:data.user});
        if (!finduser) {
      socket.emit('error', { message: 'User not found' });
      return;  
    }
        const creatingroom=await room.create({
            name:data.name,
            members:[finduser._id],
            createdBy:finduser._id
        })

        socket.emit('roomcreated',{
            roomId:creatingroom._id,
            roomname:creatingroom.name,
            members:creatingroom.members
        })
    });


    socket.on('joinroom',async(data)=>{
        const findroom=await room.findOne({_id:data.joinroomId});
        const finduser=await user.findOne({name:data.user});
        if(!findroom)
        {
            return socket.emit('joinroom-response',{
                message:"room not found!!! try again with other room"
            })
        };
            const alreadyExists = findroom.members.some((data) => data.toString() === finduser._id.toString());

            if(alreadyExists)
            {
                return socket.emit('joinroom-response',{
                    message:"user already exists in the room"
                })
            }
        if(findroom.members.length>=2){
            return socket.emit('joinroom-response',{
                message:"room is full"
            })
        }
        findroom.members.push(finduser._id);
        await findroom.save();

        socket.emit('joinroom-response',{
            findroom,
            message:"user added"
        })
    })
}
module.exports=roomsocket