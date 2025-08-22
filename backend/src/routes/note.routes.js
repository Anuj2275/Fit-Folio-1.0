import express from 'express';
import authenticationToken from '../middleware/auth.middleware.js';

import * as note from '../controllers/note.controller.js';

const router = express.Router();

router.use(authenticationToken);

router.post('/notes',note.createNote);
router.get('/notes',note.getNotes);
router.get('/notes/:id',note.getNoteById);
router.put('/notes/:id',note.updateNote);
router.delete('/notes/:id',note.createNote);

export default router;