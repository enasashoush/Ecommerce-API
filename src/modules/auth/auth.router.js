import { Router } from 'express'
import { validation } from './../../middleware/validation.js';
import * as authController from './controller/auth.controller.js'
import * as authValidation from './controller/auth.validation.js'
const router = Router()


router
    // sign up
    .post('/signUp',
        validation(authValidation.signUpSchema),
        authController.signUp)

    // confiem email
    .get('/confirmEmail/:token',
        validation(authValidation.tokenSchema),
        authController.confirmEmail)

    // refresh email
    .get('/refreshToken/:token',
        validation(authValidation.tokenSchema),
        authController.refreshToken)

    // login
    .post('/login',
        validation(authValidation.logInSchema),
        authController.login)

    //sendCode
    .patch('/sendCode',
        validation(authValidation.sendCodeSchema),
        authController.sendCode)

    // forget password
    .put('/forgotPassword/:email',
        validation(authValidation.forgetPasswordSchema),
        authController.forgotPassword)

export default router