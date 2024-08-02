
import { asyncHandller } from './../../../utlis/asyncHandler.js';
import cartModel from './../../../DB/models/Cart.model.js';
import productModel from './../../../DB/models/Product.model.js';
import orderModel from './../../../DB/models/Order.model.js';
import couponModel from './../../../DB/models/Coupon.model.js';
import createInvoice from '../../../utlis/pdfInvoice.js';
import sendEmail from '../../../utlis/email.js';
import Stripe from 'stripe';
import payment from '../../../utlis/payment.js';

export const creatOrder = asyncHandller(
    async (req, res, next) => {
        let { products, couponName, address, phone, paymentTypes } = req.body
        const { _id } = req.user
        const cart = await cartModel.findOne({ userId: _id })
        if (!cart?.products?.length) {
            return next(new Error('invalid cart', { cause: 404 }))
        }
        let coupon = { amount: 0 }
        if (couponName) {
            coupon = await couponModel.findOne({ name: couponName, usedBy: { $nin: _id } })
            if (!coupon) {
                return next(new Error('invalid coupon', { cause: 404 }))
            }
            if (coupon.expireIn.getTime() < new Date().getTime()) {
                return next(new Error('expired coupon', { cause: 400 }))
            }
        }
        if (!products?.length) {
            products = cart.products.toObject()
        }


        let allProducts = []
        let subPrice = 0
        for (const product of products) {
            const productExist = await productModel.findOne({
                _id: product.productId,
                isDeleted: false,
                stock: { $gte: product.quantity }
            })
            if (!productExist) {
                return next(new Error('invalid product', { cause: 404 }));
            }
            product.name = productExist.name
            product.unitPrice = productExist.finalPrice
            product.totalPrice = productExist.finalPrice * product.quantity
            allProducts.push(product)
            subPrice += product.totalPrice
        }

        for (const product of products) {
            await cartModel.updateOne({ userId: _id }, {
                $pull: {
                    products: {
                        productId: { $in: product.productId }
                    }
                }
            })
            await productModel.updateOne({ _id: product.productId }, { $inc: { stock: -parseInt(product.quantity) } })
        }

        req.body.products = allProducts
        req.body.subPrice = subPrice
        req.body.finalPrice = subPrice - (subPrice * coupon?.amount) / 100

        const order = await orderModel.create({ products, couponName, phone, address, paymentTypes, userId: _id, finalPrice: req.body.finalPrice, subPrice: req.body.subPrice })

        if (couponName) {
            await couponModel.updateOne({ _id: coupon._id }, { $push: { usedBy: _id } })

        }
        // create invoice
        const invoice = {
            shipping: {
                name: req.user.userName,
                address: order.address,
                city: "San Francisco",
                state: "CA",
                country: "US",
                postal_code: 94111
            },
            items: order.products,
            subtotal: subPrice,
            paid: 0,
            invoice_nr: order._id.toString(),
            createdAt: order.createdAt
        };

        createInvoice(invoice, "invoice.pdf");

        await sendEmail({
            to: req.user.email, subject: 'invoice for your order', attachments: [
                {
                    path: "invoice.pdf",
                    application: "application/pdf"
                }
            ]
        })

        //stripe
        if (order.paymentTypes == "card") {
            const stripe = new Stripe(process.env.SECRET_KEY)
            let createCoupon;
            if (couponName) {
                createCoupon = await stripe.coupons.create({
                    percent_off: coupon.amount,
                    duration: "once"
                })
            }
            const session =await payment({
                payment_method_types: ["card"],
                customer_email: req.user.email,
                metadata: {
                    orderId: order._id.toString(),
                },
                success_url: `${process.env.SUCCESS_URL}/${order._id}`,
                cancel_url: `${process.env.CANCEL_URL}/${order._id}`,
                line_items: order.products.map((element) => {
                    return {
                        price_data: {
                            currency: "usd",
                            product_data: {
                                name: element.name,
                            },
                            unit_amount: element.unitPrice * 100
                        },
                        quantity: element.quantity
                    }
                }),
                discounts: couponName ? [{ coupon: createCoupon.id }] : [],
            })
            return res.status(200).json({ message: "done", order, session })

        }
        return res.status(201).json({ message: "done", order })
    }
)

export const cancelOrder = asyncHandller(
    async (req, res, next) => {
        const { orderId } = req.params

        const order = await orderModel.findById({ _id: orderId })
        if (!order) {
            return next(new Error('invalid order', { cause: 404 }))
        }

        if (order.status != 'placed' && order.status != 'waitForPayment') {
            return next(new Error('canceld order', { cause: 400 }))

        }
        for (const product of order.products) {
            await productModel.updateOne({ _id: product.productId }, { $inc: { stock: parseInt(product.quantity) } })
        }
        if (order.couponId) {
            await couponModel.updateOne({ _id: order.couponId }, { $pull: { usedBy: _id } })

        }
        const updateOrder = await orderModel.updateOne({ _id: orderId }, { status: 'cancel', updatedBy: req.user._id })

        return res.status(200).json({ message: 'success', updateOrder })

    }

)

export const delivrdOrder = asyncHandller(
    async (req, res, next) => {
        const { orderId } = req.params

        const order = await orderModel.findById({ _id: orderId })
        if (!order) {
            return next(new Error('invalid order', { cause: 404 }))
        }

        if (order.status != 'onway') {
            return next(new Error('invalid delivary', { cause: 400 }))

        }
        const updateOrder = await orderModel.updateOne({ _id: orderId }, { status: 'deliverd', updatedBy: req.user._id })

        return res.status(200).json({ message: 'success', updateOrder })

    }

)
