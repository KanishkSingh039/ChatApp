const mongoose=require('mongoose');
const room= new mongoose.Schema({
    Type:{
        type:String,
        required:true
    },
    name:[{
        type:String,
        required:true
    }],
    members:[
        {
            type:String
        }
    ],
    createdBy:{
        type:String,
        required:true

    }
},{timestamps:true});

module.exports=new mongoose.model('room',room);