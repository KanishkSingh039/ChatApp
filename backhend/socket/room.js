const user=require('../schema/user');
const room=require('../schema/room');
const requestschema=require('../schema/request');
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
            Type:"group",
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
        // console.log(data.friend);
        // const finduser=await user.findOne({_id:data.id});
        if(!data.senderId||!data.receiverId||!data.senderName||!data.user){
        // if(!data.id||!data.friend){
            return socket.emit('roomcreatedwithfriend',{
                message:`check the data which is ${data.receiverId} ${data.user} ${data.senderId} ${data.senderName}`
            })
        }
        const alreadyinroom = await room.findOne({
            Type:"friend",
            members: {
                $all: [data.receiverId, data.senderId]
            }
        });

        if(alreadyinroom){
            return socket.emit('roomcreatedwithfriend',{
                success:false,
                createroom: alreadyinroom,
                message:"room already exists"
            });
        }

        const createroom=await room.create({
            Type:"friend",
            name:[data.senderName,data.user],
            members:[data.receiverId,data.senderId],
            createdBy:data.senderId
        })
        console.log(createroom);
        if(createroom)
        {
            await requestschema.deleteOne({
                senderId:data.senderId,
                receiverId:data.receiverId
            })
        }
        return socket.emit('roomcreatedwithfriend',{
            room:createroom,
            senderId:data.senderId,
            receiverId:data.receiverId,
            message:`room created with the ${data.senderName}`
        })
            
        } catch (error) {
            return socket.emit('roomcreatedwithfriend',error)
        }
        
    })
}
module.exports=roomsocket