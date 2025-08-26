import express from 'express';
import validateMiddleware from '../middleware/validate.middleware.js';
import { signUpSchema, loginSchema } from '../validations/auth.validation.js';
import { login, signup } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', validateMiddleware(signUpSchema), signup);
router.post('/login', validateMiddleware(loginSchema), login);

export default router;