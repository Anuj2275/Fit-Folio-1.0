// // backend/src/validations/auth.validation.js

import Joi from 'joi';

export const signUpSchema = Joi.object({
    name:Joi.string().min(3).required(),
    email:Joi.string().email().required(),
    password:Joi.string().min(6).required()
})
export const loginSchema = Joi.object({
    email:Joi.string().email().required(),
    password:Joi.string().required()
})
// import Joi from 'joi';

// // Joi schema for user signup validation
// export const signUpSchema = Joi.object({
//     name: Joi.string().min(3).required(),
//     email: Joi.string().email().required(),
//     password: Joi.string().min(6).required(),
// });

// // Joi schema for user login validation
// export const loginSchema = Joi.object({
//     email: Joi.string().email().required(),
//     password: Joi.string().required(),
// });