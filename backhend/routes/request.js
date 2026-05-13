const express=require('express');
const fetchedrequest=require('../controller/request');
const router=express.Router();
router.post('/request',fetchedrequest)
module.exports=router;