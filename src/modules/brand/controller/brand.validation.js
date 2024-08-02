import joi from 'joi';
import { generalFeilds } from './../../../utlis/generalFields.js';

export const getIdBrandSchema = joi.object({

    brandId : generalFeilds._id.required()

}).required()


export const createBrandSchema = joi.object({
    name : joi.string().max(20).min(3).trim().required(),
    file: generalFeilds.file.required(),


}).required()


export const updateBrandSchema = joi.object({
    brandId: generalFeilds._id.required(),
    name : joi.string().max(20).min(3).trim(),
    file: generalFeilds.file,


}).required()

export const tokenSchema = joi.object({
    auth: generalFeilds.token,

}).required()