import { Router } from 'express'
import { fileValidation, uploadFile } from './../../utlis/cloudinaryMulter.js';
import authen, { roles } from './../../middleware/auth.js';
import * as productValidation from './controller/product.validation.js'
import * as productController from '../product/controller/product.controller.js'
import productEndPoints from './controller/productEndPoint.js'
import { validation } from '../../middleware/validation.js';

const router = Router()

router
    .post('/',
        validation(productValidation.tokenSchema, true),
        authen(productEndPoints.create),
        uploadFile(fileValidation.image).fields([
            { name: 'mainImage', maxCount: 1 },
            { name: 'supImage', maxCount: 5 }
        ]),
        validation(productValidation.createProductSchema),
        productController.createProduct)

    .put('/:productId',
        validation(productValidation.tokenSchema, true),
        authen(productEndPoints.update),
        uploadFile(fileValidation.image).fields([
            { name: 'mainImage', maxCount: 1 },
            { name: 'supImage', maxCount: 5 }
        ]),
        validation(productValidation.updateProductSchema),
        productController.updateProduct) 

    .get('/',
    productController.allProducts)

    .get('/:productId',
    validation(productValidation.oneProductSchema),
    productController.productById)



export default router

