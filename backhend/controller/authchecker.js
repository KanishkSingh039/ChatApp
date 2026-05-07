const jwt=require('jsonwebtoken')

const authchecker=(req,res,next)=>{
    try {
        const tokendata=req.headers["authorization"];
        // console.log(tokendata);
        
        if(!tokendata||!tokendata.startsWith('Bearer')){
            return res.status(404).json({
                message:"No token provided"
            })
        }
        const token=tokendata&&tokendata.split(" ")[1];
        if(!token){
            return res.status(401).json({
                message:"token missing"
            })
        }
        const verify=jwt.verify(token,process.env.SECRET_KEY);
        if(!verify)
        {
            return res.status(400).json({
                message:"token expired login again"
            })
        }
        req.user=verify.name;
        next();
    } catch (error) {
        return res.status(500).json({
            message:`${error}`
        })
    }
}
module.exports=authchecker