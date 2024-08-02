import { Router } from 'express'
import authen from './../../middleware/auth.js';
import * as orderController from './controller/order.controller.js'
import * as orderValidation from './order.validation.js'
import orderEndPoints from './order.endpoint.js'
import { validation } from './../../middleware/validation.js';
const router = Router()

router
    .post('/',
        validation(orderValidation.tokenSchema, true),
        authen(orderEndPoints.create),
        validation(orderValidation.createOrderSchema),
        orderController.creatOrder)

    .patch('/cancelled/:orderId',
        validation(orderValidation.tokenSchema, true),
        authen(orderEndPoints.create),
        validation(orderValidation.cancelOrderSchema),
        orderController.cancelOrder)

    .patch('/deliverd/:orderId',
        validation(orderValidation.tokenSchema, true),
        authen(orderEndPoints.create),
        validation(orderValidation.deliverOrderSchema),
        orderController.delivrdOrder)

export default router