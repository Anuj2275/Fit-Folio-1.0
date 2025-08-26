import express from 'express';

import upload from '../middleware/upload.middleware.js'; 
import { uploadProfilePicture } from '../controllers/file.controller.js'; 

const router = express.Router();

router.post("/upload/profile",upload.single('picture'),uploadProfilePicture)

export default router;
