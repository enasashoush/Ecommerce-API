import joi from 'joi';
import { generalFeilds } from './../../../utlis/generalFields.js';

export const getIdCategorySchema = joi.object({

    categoryId : generalFeilds._id.required()

}).required()


export const createCategorySchema = joi.object({
    name : joi.string().max(20).min(3).trim().required(),
    file: generalFeilds.file.required(),

}).required()

export const updateCategorySchema = joi.object({
    categoryId: generalFeilds._id.required(),
    name : joi.string().max(20).min(3).trim(),
    file: generalFeilds.file,

}).required()

export const tokenSchema = joi.object({
    auth: generalFeilds.token,

}).required()