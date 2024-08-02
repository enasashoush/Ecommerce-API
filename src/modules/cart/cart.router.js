import { Router } from 'express'
import * as cartController from './controller/cart.controller.js'
import * as cartValidation from './controller/cart.validation.js'
import cartEndPoints from './controller/cart.endpoint.js'
import { validation } from '../../middleware/validation.js'
import authen from '../../middleware/auth.js'

const router = Router()

router
    .post('/',
        validation(cartValidation.tokenSchema, true),
        authen(cartEndPoints.cart),
        validation(cartValidation.addToCartSchema),
        cartController.addToCart)

    .patch('/:productId',
        validation(cartValidation.tokenSchema, true),
        authen(cartEndPoints.cart),
        validation(cartValidation.deleteFromCartSchema),
        cartController.deleteFromCart
    )
    .patch('/',
        validation(cartValidation.tokenSchema, true),
        authen(cartEndPoints.cart),
        cartController.clearCart
    )

export default router

