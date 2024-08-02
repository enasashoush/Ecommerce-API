import { Router } from 'express'
import { validation } from '../../middleware/validation.js'
import { fileValidation, uploadFile } from '../../utlis/cloudinaryMulter.js'
import supCategoryRouter from '../supcategory/supcategory.router.js'
import authen from './../../middleware/auth.js';
import categoryEndPoints from './controller/category.endpoints.js'
import * as categoryValidation from './controller/category.validation.js'
import * as categoryController from './controller/category.controller.js'


const router = Router()

router
    // create category
    .post('/',
        validation(categoryValidation.tokenSchema, true),
        authen(categoryEndPoints.create),
        uploadFile(fileValidation.image).single('file'),
        validation(categoryValidation.createCategorySchema),
        categoryController.createCategory)

    // get All Categories
    .get('/',
        categoryController.getAllCategory)

    // get Category by ID
    .get('/:categoryId',
        validation(categoryValidation.getIdCategorySchema),
        categoryController.getIdCategory)

    // update category
    .put('/:categoryId',
        validation(categoryValidation.tokenSchema, true),
        authen(categoryEndPoints.update),
        uploadFile(fileValidation.image).single('file'),
        validation(categoryValidation.updateCategorySchema),
        categoryController.updateCategory)

    .use('/:categoryId/subCategory',
        supCategoryRouter)

export default router

