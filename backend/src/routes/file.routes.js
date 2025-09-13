import express from 'express';
import multer from 'multer';
import { uploadProfilePicture } from '../controllers/file.controller.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/files/upload-profile-picture', upload.single('picture'), uploadProfilePicture);

export default router;