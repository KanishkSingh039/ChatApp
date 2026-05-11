const user=require('../schema/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken')
const register=async(req,res)=>{
    try {
        if(!req.body.name||!req.body.email||!req.body.password)
        {
            return res.status(404).json({
                message:"please enter all the credentials"
            })
        }
        const {name,uniqueId,email,password}=req.body;
        const finduserbyemail=await user.findOne({email});
        if(finduserbyemail)
        {
            return res.status(400).json({
                message:"user already exists with this email"
            })
        };
        const finduserbyuniqueId=await user.findOne({uniqueId});
        if(finduserbyuniqueId)
        {
            return res.status(400).json({
                message:"user already exists with this uniqueId"
            });
        }

        const salt=10;
        const gsalt=await bcrypt.genSalt(salt);
        const hashpassword=await bcrypt.hash(password,salt);
        const createuser=await user.create({
            name,
            uniqueId,
            email,
            password:hashpassword
        });
        return res.status(200).json({
            message:"user created"
        })
    } catch (error) {
        return res.status(500).json({
            message:`${error.message}`
        })
    }
}

const login=async(req,res)=>{
    try {
        const {email,password}=req.body;
        const verifyuser=await user.findOne({email});
        if(!verifyuser)
        {
            return res.status(404).json({
                message:"user not found! Please register first"
            })
        }
        const verifypass=await bcrypt.compare(password,verifyuser.password);
        if(!verifypass)
        {
            return res.status(500).json({
                message:"wrong password! try again"
            })
        }
        const token=jwt.sign({
            name:verifyuser.name,
            email,
            password:verifypass.password,
    
        },process.env.SECRET_KEY, { expiresIn: "15m" });

        return res.status(200).json({
            message:"login successfull",
            token
        })
        
    } catch (error) {
        return res.status(500).json({
            message:`${error.message}`
        })
    }
}
module.exports={
    register,login
}