const express=require('express');
const authchecker=require('../controller/authchecker');
const fetchedmessage=require('../controller/message');
const router=express.Router();
router.post('/message',authchecker,fetchedmessage)
module.exports=router;