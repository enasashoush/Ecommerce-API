import { asyncHandller } from './../../../utlis/asyncHandler.js';
import cloudinary from './../../../utlis/cloudinary.js';
import couponModel from './../../../DB/models/Coupon.model.js';


// create Coupon
export const createCoupon = asyncHandller(async (req, res, next) => {
    const { name } = req.body

    if (await couponModel.findOne({ name })) {
        return next(new Error("coupon exists", { cause: 409 }))

    }


    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/coupon` })

        if (!secure_url) {
            return next(new Error("image not found", { cause: 400 }))

        
        }
        req.body.image = { public_id, secure_url }

    }

    req.body.createdBy = req.user._id

    const coupon = await couponModel.create(req.body)

    return res.status(200).json({ message: "Done", coupon })
})


// get All Coupons
export const getAllCoupon = asyncHandller(async (req, res, next) => {
    const coupons = await couponModel.find()

    return res.status(200).json({ message: "done", coupons })

})


// get Coupon by ID
export const getIdCoupon = asyncHandller(async (req, res, next) => {
    const { couponId } = req.params

    const coupon = await couponModel.findById({ _id: couponId })

    return res.status(200).json({ message: "done", coupon })

})


// update coupon
export const updateCoupon = asyncHandller(async (req, res, next) => {

    const { couponId } = req.params
    const couponExists = await couponModel.findById({ _id: couponId })

    if (!couponExists) {
        return next(new Error("invalid coupon id", { cause: 404 }))
    }


    if (req.body.name) {
        if (await couponModel.findOne({ name: req.body.name })) {
            return next(new Error("name already exist", { cause: 409 }))

        }

    }

    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/coupon` })

        if (!secure_url) {
            return next(new Error("image not found", { cause: 400 }))

        }

        if (couponExists.image?.public_id) {
            await cloudinary.uploader.destroy(couponExists.image.public_id)

        }

        req.body.image = { public_id, secure_url }
    }


    req.body.updatedBy = req.user._id


    const newCoupon = await couponModel.findByIdAndUpdate({ _id: couponId }, req.body, { new: true })

    return res.status(200).json({ message: "done", coupon: newCoupon })

}

)