import express from 'express';

import upload from '../middleware/upload.middleware.js';  // responsible for processing the incoming file data

import { uploadProfilePicture } from '../controllers/file.controller.js'; // it containes the logic for processing the uploaded image

const router = express.Router();


// multer middleware --> upload.single() --> single means we expect only one file in this upload request
// 'picture' --> name attrribute of the file input field on the ))frontend** form
router.post("/upload/profile",upload.single('picture'),uploadProfilePicture)


export default router;
