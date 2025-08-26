import Joi from "joi";
export const createItemSchema = Joi.object({
  title: Joi.string().min(1).required(),
  dueDate: Joi.date().allow(null, ""), 
  type: Joi.string().valid("task", "habit"),
  completed: Joi.boolean(),
});

export const updateItemSchema = Joi.object({
  title: Joi.string().min(1),
  dueDate: Joi.date().allow(null, ""), 
  type: Joi.string().valid("task", "habit"),
  completed: Joi.boolean(),
}).min(1);