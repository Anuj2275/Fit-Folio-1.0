// // backend/src/validations/item.validation.js

import Joi from "joi";
export const createItemSchema = Joi.object({
  title: Joi.string().min(1).required(),
  dueDate: Joi.date().allow(null, ""), // allowing null or empty
  type: Joi.string().valid("task", "habit"),
  completed: Joi.boolean(),
});

// now we are updating and the user wanted to updated a single thing or more, so the min will be 1 at least we gonna use min
export const updateItemSchema = Joi.object({
  title: Joi.string().min(1),
  dueDate: Joi.date().allow(null, ""), // allowing null or empty
  type: Joi.string().valid("task", "habit"),
  completed: Joi.boolean(),
}).min(1);

// import Joi from "joi";
// // Joi schema for creating a new item
// export const createItemSchema = Joi.object({
//   title: Joi.string().min(1).required(),
//   dueDate: Joi.date().allow(null, ""), // Allow null or empty string
//   type: Joi.string().valid("task", "habit"),
//   completed: Joi.boolean(),
// });

// // Joi schema for updating an item
// export const updateItemSchema = Joi.object({
//   title: Joi.string().min(1),
//   dueDate: Joi.date().allow(null, ""), // Allow null or empty string
//   type: Joi.string().valid("task", "habit"),
//   completed: Joi.boolean(),
// }).min(1); // Require at least one field to be present for an update
