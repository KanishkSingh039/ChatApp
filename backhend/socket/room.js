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
        if(findroom.members.length>=100){
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
    socket.on('finduser',async(data)=>{
        const finduser=await user.findOne({name:data});
        if(!finduser)
        {
            return socket.emit('userid',{
                message:"user is not found"
            })
        }

        return socket.emit('userid',{
            success:true,
            id:finduser._id
    });
    })
    socket.on('findfriend',async(data)=>{
        const {uniqueId}=data;
        const findfrindwithuniqueId=await user.findOne({uniqueId});
        if(!findfrindwithuniqueId)
        {
            return socket.emit('friendfinded',{
                message:"user not found with this uniqueId"
            })
        }
        return socket.emit('friendfinded',{
            friend:findfrindwithuniqueId
        })
    })

    socket.on('createroomwiththefriend',async(data)=>{
        try {
            console.log(data);
        console.log(data.friend);
        
        if(!data.id||!data.friend){
            return socket.emit('roomcreatedwithfriend',{
                message:`check the data which is ${data.id,data.friend}`
            })
        }
        const alreadyinroom = await room.findOne({
            members: {
                $all: [data.id, data.friend.id]
            }
        });

        if(alreadyinroom){
            return socket.emit('roomcreatedwithfriend',{
                success:true,
                createroom: alreadyRoom,
                message:"room already exists"
            });
        }

        const createroom=await room.create({
            name:data.friend.name,
            members:[data.id,data.friend.id],
            createdBy:data.id
        })
        return socket.emit('roomcreatedwithfriend',{
            createroom,
            message:`room created with the ${data.friend.name}`
        })
            
        } catch (error) {
            return socket.emit('roomcreatedwithfriend',error)
        }
        
    })
}
module.exports=roomsocket