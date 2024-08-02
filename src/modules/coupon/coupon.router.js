import { Router } from 'express'
import { validation } from '../../middleware/validation.js';
import { fileValidation, uploadFile } from '../../utlis/cloudinaryMulter.js'
import * as couponController from './controller/couponController.js'
import * as couponValidation from './controller/couponValidation.js'
import authen from './../../middleware/auth.js';
import couponEndPoints from './controller/coupon.endpoint.js'

const router = Router()

router
    // create coupon
    .post('/',
        validation(couponValidation.tokenSchema, true),
        authen(couponEndPoints.create),
        uploadFile(fileValidation.image).single('file'),
        validation(couponValidation.createCouponSchema),
        couponController.createCoupon)

    // get All coupon
    .get('/',
        couponController.getAllCoupon)

    // get coupon by ID
    .get('/:couponId',
        validation(couponValidation.getIdCouponSchema),
        couponController.getIdCoupon)

    // update coupon
    .put('/:couponId',
        validation(couponValidation.tokenSchema, true),
        authen(couponEndPoints.update),
        uploadFile(fileValidation.image).single('file'),
        validation(couponValidation.updateCouponSchema),
        couponController.updateCoupon)

export default router

