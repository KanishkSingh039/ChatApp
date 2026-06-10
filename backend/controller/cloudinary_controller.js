const cloudinary = require('../cloudinary_config/cloudinary_config')
const upload_image = async (req, res) => {
    try {        
        console.log(req.file);
        
        if(!req.file){
            return res.status(400).json({
                message:"please provide image file to upload"
            });
        }
        
        const uploadimage=await cloudinary.uploader.upload(req.file.path,{
            resource_type:"raw",
            use_filename:true
        });        
        console.log(uploadimage);
        // console.log("resource_type:", uploadimage.resource_type);
        // console.log("format:", uploadimage.format);
        // console.log({
        //     resource_type: uploadimage.resource_type,
        //     type: uploadimage.type,
        //     access_mode: uploadimage.access_mode,
        //     secure_url: uploadimage.secure_url
        // });
        return res.status(200).json({
            message:"upload image successfully",
            url:uploadimage.secure_url,
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

module.exports = {
    upload_image
}