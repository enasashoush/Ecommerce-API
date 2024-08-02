import { Router } from 'express'
import { validation } from '../../middleware/validation.js'
import { fileValidation, uploadFile } from '../../utlis/cloudinaryMulter.js'
import authen from './../../middleware/auth.js';
import supCategoryEndPoints from './controller/supCategories.endpoint.js';
import * as supCategoryController from './controller/supcategory.controller.js'
import * as supCategoryValidation from './controller/supcategory.validation.js'

const router = Router({ mergeParams: true })

router
    // create supCategory
    .post('/',
        validation(supCategoryValidation.tokenSchema, true),
        authen(supCategoryEndPoints.create),
        uploadFile(fileValidation.image).single('file'),
        validation(supCategoryValidation.createSupCategorySchema),
        supCategoryController.createSupCategory)

    // get All supCategories
    .get('/',
        supCategoryController.getAllSupCategory)

    //  get supCategory by ID
    .get('/:supCategoryId',
        validation(supCategoryValidation.getIdSupCategorySchema),
        supCategoryController.getIdSupCategory)

    //update supCategory
    .put('/:supCategoryId',
        validation(supCategoryValidation.tokenSchema, true),
        authen(supCategoryEndPoints.update),
        uploadFile(fileValidation.image).single('file'),
        validation(supCategoryValidation.updateSupCategorySchema),
        supCategoryController.updateSupCategory)


export default router

