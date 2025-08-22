// backend/src/routes/item.routes.js
import express from 'express';
import validateMiddleware from '../middleware/validate.middleware.js';
import auth from '../middleware/auth.middleware.js';
import { createItemSchema, updateItemSchema } from '../validations/item.validation.js';
import * as ctrl from '../controllers/item.controller.js';

const router = express.Router();

// All item routes are protected and require authentication
router.use(auth);

router.post("/", validateMiddleware(createItemSchema), ctrl.createItem);
router.get("/", ctrl.getItems);
router.get("/:id", ctrl.getItemById);
router.put("/:id", validateMiddleware(updateItemSchema), ctrl.updateItem);
router.delete("/:id", ctrl.deleteItem);

export default router;