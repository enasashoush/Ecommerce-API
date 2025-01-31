import joi from 'joi';
import { generalFeilds } from './../../../utlis/generalFields.js';

export const getIdCouponSchema = joi.object({

    couponId : generalFeilds._id.required()

}).required()


export const createCouponSchema = joi.object({
    name : joi.string().max(20).min(3).trim().required(),
    file: generalFeilds.file,
    amount: joi.number().positive().min(1).max(100).required(),
    expireIn: joi.string(),


}).required()


export const updateCouponSchema = joi.object({
    couponId: generalFeilds._id.required(),
    name : joi.string().max(20).min(3).trim(),
    file: generalFeilds.file,
    amount: joi.number().positive().min(1).max(100),
    expireIn: joi.string(),



}).required()

export const tokenSchema = joi.object({
    auth: generalFeilds.token,

}).required()