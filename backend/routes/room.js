const express=require('express');
const authchecker=require('../controller/authchecker');
const roomfetch=require('../controller/roomfetch') 
const router=express.Router();

router.post('/rooms',authchecker,roomfetch);
module.exports=router;