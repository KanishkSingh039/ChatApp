const room=require('../schema/room');

const roomfetching=async(req,res)=>{
    try {
        console.log(req.body.id);
        
        const data=await room.find({members:req.body.id});
        console.log(data);
        
        if(data.length>0)
        {
            return res.status(200).json({
                data,
                message:"rooms fetched successfully"
            })
        }
        return res.status(404).json({
            message:"user not exists in any room"
        })
        
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
}
module.exports=roomfetching
