import { asyncHandller } from './../../../utlis/asyncHandler.js';
import cartModel from './../../../DB/models/Cart.model.js';
import productModel from './../../../DB/models/Product.model.js';

export const addToCart = asyncHandller(async (req, res, next) => {

    const { _id } = req.user
    const { productId, quantity } = req.body

    const cart = await cartModel.findOne({ userId: _id })

    const product = await productModel.findOne({ _id: productId, isDeleted: false, stock: { $gte: quantity } })

    if (!product) {
        return next(new Error('invalid product id', { cause: 404 }))

    }

    if (!cart) {
        const data = {
            userId: _id,
            products: [
                {
                    productId: product._id,
                    quantity

                }
            ]
        }

        const newCart = await cartModel.create(data)

        return res.status(201).json({ message: "done", cart: newCart })

    }


    let exist = false
    for (let product of cart.products) {
        if (product.productId.toString() == productId) {
            product.quantity = quantity
            exist = true
            break
        }
    }

    if (!exist) {
        const add = await cartModel.findByIdAndUpdate({ _id: cart._id }, {
            $push: {
                products: {
                    productId: product._id,
                    quantity

                }
            }
        }, { new: true })
        return res.status(200).json({ message: "done", cart: add })
    }

    const add = await cartModel.findByIdAndUpdate({ _id: cart._id }, {
        products: cart.products
    }, { new: true })
    return res.status(200).json({ message: "done", cart: add })

})

export const deleteFromCart = asyncHandller(
    async (req,res,next) => {

        const { _id } = req.user

        const cart = await cartModel.findOne({ userId: _id })

        if(!cart){
            return next(new Error("Cart not found",{ cause:404}))
        }

        const newCart = await cartModel.findByIdAndUpdate({ _id: cart._id },{$pull: {
            products: {
                productId: {$in:req.params.productId},
            }
        }},{ new: true })
        return res.status(200).json({ message: "done", cart: newCart })
    }
)

export const clearCart = asyncHandller(
    async (req,res,next) => {

        const { _id } = req.user

        const cart = await cartModel.findOne({ userId: _id })

        if(!cart){
            return next(new Error("Cart not found",{ cause:404}))
        }

        const newCart = await cartModel.findByIdAndUpdate({ _id: cart._id },{
            products:[]
        },{ new: true })
        return res.status(200).json({ message: "done", cart: newCart })
    }
)