import { Router } from 'express'
import { validation } from '../../middleware/validation.js'
import { fileValidation, uploadFile } from '../../utlis/cloudinaryMulter.js'
import * as brandController from './controller/brand.controller.js'
import * as brandValidation from './controller/brand.validation.js'
import authen from './../../middleware/auth.js';
import brandEndPoints from './controller/brand.endpoint.js';

const router = Router()

router
  // create brand
  .post('/',
    validation(brandValidation.tokenSchema, true),
    authen(brandEndPoints.create),
    uploadFile(fileValidation.image).single('file'),
    validation(brandValidation.createBrandSchema),
    brandController.createBrand)

  // get All brands
  .get('/',
    brandController.getAllBrands)

  // get brand by ID
  .get('/:brandId',
    validation(brandValidation.getIdBrandSchema),
    brandController.getIdBrand)

  // update brand
  .put('/:brandId',
    validation(brandValidation.tokenSchema, true),
    authen(brandEndPoints.update),
    uploadFile(fileValidation.image).single('file'),
    validation(brandValidation.updateBrandSchema),
    brandController.updateBrand)


export default router

