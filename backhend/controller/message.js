const messageschema=require('../schema/message');
const fetchmessage=async(req,res)=>{
    try {
        const findallmessageoftheroom=await messageschema.find({roomId:req.body.roomId});
    if(!findallmessageoftheroom)
    {
        return res.status(404).json({
            message:`no message found for this roomId: ${req.body.roomId} `
        })
    }
    return res.status(200).json({
        content:findallmessageoftheroom
    })
    } catch (error) {
        return res.status(500).json({
            message:`${error}`
        })
    }
    
}
module.exports=fetchmessage