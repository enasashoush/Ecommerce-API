import { asyncHandller } from './../../../utlis/asyncHandler.js';
import { customAlphabet } from 'nanoid';
import { generateToken, verifyToken } from './../../../utlis/generateAndVerifyToken.js';
import { compare, hash } from './../../../utlis/hashAndCompare.js';
import userModel from './../../../DB/models/User.model.js';
import sendEmail from '../../../utlis/email.js';

// sign up
export const signUp = asyncHandller(async (req, res, next) => {
    const { email } = req.body


    if (await userModel.findOne({ email })) {
        return next(new Error('email already exists', { cause: 403 }));
    }

    const token = generateToken({
        payload: { email },
        signature: process.env.AUTH_SIGNATURE,
        expiresIn: 60 * 30
    })
    const refreshToken = generateToken({
        payload: { email },
        signature: process.env.AUTH_SIGNATURE,
        expiresIn: 60 * 60 * 24 * 30
    })

    const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`
    const refreshLink = `${req.protocol}://${req.headers.host}/auth/refreshToken/${refreshToken}`

    const html = ` 
    <a href="${link}"> confirm Email </a>
    <br/> <br/ >
    <a href="${refreshLink}"> refresh link </a>`

    if (!sendEmail({ to: email, subject: 'confirm Email', html })) {

        return next(new Error('invalid email', { cause: 404 }))
    }

    req.body.password = hash({ plaintext: req.body.password })

    const newUser = await userModel.create(req.body)

    return res.status(201).json({ message: "done", user: newUser._id })
})

// confirm email
export const confirmEmail = asyncHandller(async (req, res, next) => {

    const { token } = req.params
    const { email } = verifyToken({ token, signature: process.env.SIGN_UP_SIGNATURE })

    if (!email) {
        return res.redirect('https://www.linkedin.com/')
    }

    const user = await userModel.findOne({ email })
    if (!user) {
        return res.redirect('https://www.facebook.com/')
    }

    if (user.confirmEmail) {
        return res.redirect('https://www.instagram.com/')

    }

    await userModel.updateOne({ email }, { confirmEmail: true })
    return res.redirect('https://www.facebook.com/')

})

// refresh email
export const refreshToken = asyncHandller(async (req, res, next) => {

    const { token } = req.params
    const { email } = verifyToken({ token, signature: process.env.SIGN_UP_SIGNATURE })

    if (!email) {
        return res.redirect('https://www.linkedin.com/')
    }

    const user = await userModel.findOne({ email })
    if (!user) {
        return res.redirect('https://www.facebook.com/')
    }

    if (user.confirmEmail) {
        return res.redirect('https://www.instagram.com/')

    }

    const newToken = generateToken({
        payload: { email },
        signature: process.env.SIGN_UP_SIGNATURE,
        expiresIn: 60 * 10
    })

    const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${newToken}`

    const html = ` 
    <a href="${link}"> confirm Email </a>`

    if (!sendEmail({ to: email, subject: 'confirm Email', html })) {

        return next(new Error('invalid email', { cause: 404 }))
    }


    return res.send('<h1> check your email</h1>')

})

// login
export const login = asyncHandller(async (req, res, next) => {

    const { email, password } = req.body
    const emailExists = await userModel.findOne({ email })
    if (!emailExists) {
        return next(new Error('email or password not correct', { cause: 400 }))
    }

    if (!emailExists.confirmEmail) {
        return next(new Error('please confirm your email first', { cause: 409 }))

    }

    if (!compare({ plaintext: password, hashValue: emailExists.password })) {
        return next(new Error('email or password not valid', { cause: 400 }))

    }

    const token = generateToken({
        payload: { email, id: emailExists._id },
        signature: process.env.AUTH_SIGNATURE,
        expiresIn: 60 * 30
    })
    const refreshToken = generateToken({
        payload: { email, id: emailExists._id },
        signature: process.env.AUTH_SIGNATURE,
        expiresIn: 60 * 60 * 24 * 30
    })


    await userModel.updateOne({ email }, { status: 'Online' })
    return res.json({ message: 'done', token, refreshToken })

})

// sendCode
export const sendCode = asyncHandller(async (req, res, next) => {
    const { email } = req.body

    const emailExists = await userModel.findOne({ email })
    if (!emailExists) {

        return next(new Error('email not found', { cause: 404 }));

    }
    if (!emailExists.confirmEmail) {

        return next(new Error('confirm your mail first', { cause: 400 }));

    }

    const nanoid = customAlphabet('0123456789', 6)
    const code = nanoid()
    if (!sendEmail({ to: email, subject: "forget password", html: `<p> ${code} </p>` })) {
        return next(new Error('failed to send email', { cause: 409 }));

    }
    await userModel.updateOne({ email }, { code })

    return res.status(200).json({ message: 'check your email' })
})

// forgot password

export const forgotPassword = asyncHandller(async (req, res, next) => {
    const { email } = req.params
    const { code, password } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
        return next(new Error('email not found', { cause: 404 }));
    }

    if (code != user.code) {
        return next(new Error('code is not correct', { cause: 400 }));
    }

    const hashPassword = hash({plaintext: password})

    await userModel.updateOne({ email}, {password: hashPassword, code: null, status: 'Offline'})

    return res.status(200).json({message: "password updated successfully"})
})

