const mongoose=require('mongoose');

const request= new mongoose.Schema({
    senderId:{
        type:String,
        required:true
    },
    senderName:{
        type:String,
        required:true
    },
    receiverId:{
        type:String,
        required:true
    },


},{timestamps:true});
module.exports=new mongoose.model('request',request);