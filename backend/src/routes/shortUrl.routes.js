import express from 'express';
import authenicationToken from '../middleware/auth.middleware.js';
import { createShortUrl,redirectToLongUrl } from '../controllers/shortUrl.controller.js';

const router = express.Router();

router.post("/shorten",authenicationToken,createShortUrl);
router.get('/shortCode',redirectToLongUrl);

export default router;
