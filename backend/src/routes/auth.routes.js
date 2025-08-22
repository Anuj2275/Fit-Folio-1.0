// backend/src/routes/auth.routes.js
import express from 'express';
import validateMiddleware from '../middleware/validate.middleware.js';
import { signUpSchema, loginSchema } from '../validations/auth.validation.js';
import { login, signup } from '../controllers/auth.controller.js';

const router = express.Router();

// Route for user signup, with validation middleware
router.post('/signup', validateMiddleware(signUpSchema), signup);
// Route for user login, with validation middleware
router.post('/login', validateMiddleware(loginSchema), login);

export default router;