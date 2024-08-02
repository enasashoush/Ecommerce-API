import joi from 'joi';
import { generalFeilds } from './../../../utlis/generalFields.js';

export const getIdSupCategorySchema = joi.object({

  supCategoryId: generalFeilds._id,
  categoryId: generalFeilds._id


}).required()


export const createSupCategorySchema = joi.object({
  name: joi.string().max(20).min(3).trim().required(),
  file: generalFeilds.file.required(),
  categoryId: generalFeilds._id,


}).required()


export const updateSupCategorySchema = joi.object({
  supCategoryId: generalFeilds._id,
  categoryId: generalFeilds._id,
  name: joi.string().max(20).min(3).trim(),
  file: generalFeilds.file,


}).required()

export const tokenSchema = joi.object({
  auth: generalFeilds.token,

}).required()