import joi from 'joi';
import { generalFeilds } from '../../utlis/generalFields.js';

export const tokenSchema = joi.object({
    auth: generalFeilds.token,

}).required()

export const createOrderSchema = joi.object({

    address: joi.string().min(20).max(200).required(),
    phone: joi.array().items(joi.string().required()).required(),
    paymentTypes: joi.string().valid('card', 'cash'),
    note: joi.string().min(20),
    couponName: joi.string().min(3).max(20).trim(),
    products: joi.array().items(joi.object({
        productId: generalFeilds._id,
        quantity: joi.number().min(1).positive().integer().required()

    }))
}).required()


export const cancelOrderSchema = joi.object({
    orderId: generalFeilds._id
}).required()

export const deliverOrderSchema = joi.object({
    orderId: generalFeilds._id
}).required()

