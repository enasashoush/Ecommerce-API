import joi from 'joi';
import { generalFeilds } from './../../../utlis/generalFields.js';

export const createProductSchema = joi.object({
    name: joi.string().min(3).max(30).required(),
    description: joi.string().min(3).max(50),
    price: joi.number().positive().min(1).required(),
    discount: joi.number().positive(),
    stock: joi.number().positive().integer().min(1).required(),
    colors: joi.array(),
    size: joi.array(),
    files: joi.object({
        mainImage: joi.array().items(generalFeilds.file.required()).length(1).required(),
        supImage: joi.array().items(generalFeilds.file.required()).min(0).max(5)
    }).required(),
    categoryId: generalFeilds.token,
    brandId: generalFeilds.token,
    supCategoryId: generalFeilds.token,
}).required()

export const updateProductSchema = joi.object({
    name: joi.string().min(3).max(30),
    description: joi.string().min(3).max(50),
    price: joi.number().positive().min(1),
    discount: joi.number().positive(),
    stock: joi.number().positive().integer().min(1),
    colors: joi.array(),
    size: joi.array(),
    files: joi.object({
        mainImage: joi.array().items(generalFeilds.file.required()).length(1),
        supImage: joi.array().items(generalFeilds.file.required()).min(0).max(5)
    }).required(),
    productId: generalFeilds._id,
    brandId: generalFeilds.id,
    supCategoryId: generalFeilds.id,
}).required()

export const oneProductSchema =joi.object({
    productId: generalFeilds._id
})

export const tokenSchema = joi.object({
    auth: generalFeilds.token,

}).required()

