
import userModel from '../../../DB/models/User.model.js';
import { asyncHandller } from './../../../utlis/asyncHandler.js';
import productModel from './../../../DB/models/Product.model.js';

export const addToWishlist = asyncHandller(
    async (req, res, next) => {
        const { productId } = req.params

        const product = await productModel.findById({ _id: productId, isDeleted: false })

        if (!product) {

            return next(new Error('invalid product', { cause: 404 }))

        }
        const user = await userModel.findByIdAndUpdate({ _id: req.user._id }, { $addToSet: { wishlist: product._id }}, {new: true} )
        .select('userName email wishlist status').populate([
            {
                path:'wishlist'
            }
        ])
        return res.json({message:"done", user})
    }
)

export const removeFromWishlist = asyncHandller(
    async (req, res, next) => {
        const { productId } = req.params
        const product = await productModel.findById({ _id: productId, isDeleted: false })
        if (!product) {
            return next(new Error('invalid product', { cause: 404 }))
        }
        const user = await userModel.findByIdAndUpdate({ _id: req.user._id }, { $pull: { wishlist: product._id }}, {new: true} )
        .select('userName email wishlist status').populate([
            {
                path:'wishlist'
            }
        ])
        return res.json({message:"done", user})
    }
)