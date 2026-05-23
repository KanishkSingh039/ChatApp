const express=require('express');
const fetchedrequest=require('../controller/request');
const authchecker = require('../controller/authchecker');
const router=express.Router();
router.post('/request',authchecker,fetchedrequest)
module.exports=router;