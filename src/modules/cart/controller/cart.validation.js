import joi from 'joi';
import { generalFeilds } from './../../../utlis/generalFields.js';

export const tokenSchema = joi.object({
    auth: generalFeilds.token,

}).required()

export const addToCartSchema = joi.object({
 
    productId: generalFeilds._id,
    quantity: joi.number().min(1).positive().integer().required()
}).required()

export const deleteFromCartSchema = joi.object({
 
    productId: generalFeilds._id,
    quantity: joi.number().min(1).positive().integer().required()

}).required()