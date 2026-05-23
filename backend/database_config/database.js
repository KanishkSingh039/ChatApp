require('dotenv').config();
const mongoose=require('mongoose');
const connecting=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("connected with database");
        
        
    } catch (error) {
        console.log(error.message);
        
    }
}
module.exports=connecting;