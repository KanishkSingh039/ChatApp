const express=require('express');
const authchecker=require('../controller/authchecker');
const fetchedmessage=require('../controller/message');
const router=express.Router();
router.post('/message',fetchedmessage)
module.exports=router;