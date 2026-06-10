const mongoose=require('mongoose');
const message=new mongoose.Schema({
    roomId:{
        type:String,
        required:true
    },
    senderId:{
        type:String,
        required:true,
    },
    public_id:{
        type:String,
    },
    category:{
        type:String,
        default:'text',
        required:true
    },
    content:{
        type:String,
        required:true
    },

},{timestamps:true});
module.exports=new mongoose.model('message',message);