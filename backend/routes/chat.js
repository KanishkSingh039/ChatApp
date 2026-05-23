const express=require('express');
const authchecker=require('../controller/authchecker');
const chat=require('../controller/chat');
const router=express.Router();
router.post('/chat',authchecker,chat)
module.exports=router;