import joi from 'joi'
import { generalFeilds } from './../../../utlis/generalFields.js';

export const signUpSchema = joi.object({
    userName: joi.string().min(2).max(20).required(),
    email: generalFeilds.email.required(),
    password: generalFeilds.password.required(),
    cPassword: joi.string().valid(joi.ref('password')).required(),
    file: generalFeilds.file,
    phone:joi.string(),
    gender: joi.string(),
    age: joi.number(),
}).required()

export const logInSchema = joi.object({
    email: generalFeilds.email.required(),
    password: generalFeilds.password.required(),
 

}).required()

export const tokenSchema = joi.object({
    token: joi.string().required(),

}).required()

export const sendCodeSchema = joi.object({
    email: generalFeilds.email.required(),
 

}).required()

export const forgetPasswordSchema = joi.object({
    email: generalFeilds.email.required(),
    code: joi.string().pattern(/^\d{6}$/).required(),
    password: generalFeilds.password.required(),
    cPassword: joi.string().valid(joi.ref('password')).required(),


}).required()