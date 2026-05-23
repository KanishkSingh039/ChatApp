const mongoose=require('mongoose');
const user=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    uniqueId:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    }
},{timestamps:true});
module.exports=new mongoose.model('user',user)
