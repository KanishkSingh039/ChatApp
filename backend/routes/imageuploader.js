const express = require('express');
const authchecker = require('../controller/authchecker');
const { upload_image } = require('../controller/cloudinary_controller');
const storage=require('../controller/uploadimage_middleware');
const router = express.Router();
// router.post('/upload', authchecker, upload_image)
router.post('/uploadfile', authchecker, storage.single('raw'), upload_image)
router.post('/uploadimage', authchecker, storage.single('image'), upload_image)
module.exports = router;