import { asyncHandller } from './../../../utlis/asyncHandler.js';
import categoryModel from './../../../DB/models/Category.model.js';
import brandModel from './../../../DB/models/Brand.model.js';
import supCategoryModel from './../../../DB/models/Subcategory.model.js';
import slugify from 'slugify';
import { nanoid } from 'nanoid';
import cloudinary from './../../../utlis/cloudinary.js';
import productModel from './../../../DB/models/Product.model.js';


//create product
export const createProduct = asyncHandller(async (req, res, next) => {

    const { categoryId, brandId, supCategoryId, price, discount } = req.body

    if (!await categoryModel.findById(categoryId)) {

        return next(new Error("invalid category id ", { cause: 400 }))

    }
    if (!await brandModel.findById(brandId)) {

        return next(new Error("invalid brand id ", { cause: 400 }))

    }
    if (!await supCategoryModel.findById(supCategoryId)) {

        return next(new Error("invalid supCategory id ", { cause: 400 }))

    }

    req.body.slug = slugify(req.body.name, {
        trim: true,
        lower: true,
    })



    req.body.finalPrice = price - (price * discount || 0) / 100

    req.body.customId = nanoid()

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.mainImage[0].path, { folder: `${process.env.APP_NAME}/product/${req.body.customId}/mainImage` })

    if (!secure_url) {
        return next(new Error("image not found", { cause: 400 }))

    }

    req.body.mainImage = { secure_url, public_id }

    if (req.files.supImage.length) {
        let images = []
        for (const image of req.files.supImage) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.supImage[0].path, { folder: `${process.env.APP_NAME}/product/${req.body.customId}/subImage` })

            if (!secure_url) {
                return next(new Error("image not found", { cause: 400 }))

            }

            images.push({ secure_url, public_id })
        }

        req.body.supImages = images

    }

    req.body.createdBy = req.user._id

    const product = await productModel.create(req.body)
    return res.status(200).json({ message: 'done', product })
})

// update product
export const updateProduct = asyncHandller(async (req, res, next) => {

    const { productId } = req.params

    const product = await productModel.findById(productId)

    if (!product) {
        return next(new Error("invalid category id ", { cause: 400 }))
    }
    if (req.body.supCategoryId && !await supCategoryModel.findById({ _id: req.body.supCategoryId })) {
        return next(new Error("invalid supCategory id ", { cause: 404 }))
    }
    if (req.body.brandId && !await brandModel.findById({ _id: req.body.brandId })) {
        return next(new Error("invalid brand id ", { cause: 404 }))
    }

    if (req.body.name) {
        req.body.slug = slugify(req.body.name, {
            trim: true,
            lower: true
        })
    }

    // if (req.body.price && req.body.discount) {
    //     req.body.finalPrice = req.body.price - (req.body.price * req.body.discount) / 100
    // }
    // else if (req.body.price) {
    //     req.body.finalPrice = req.body.price - (req.body.price * product.discount) / 100

    // }
    // else if (req.body.discount) {
    //     req.body.finalPrice = product.price - (product.price * req.body.discount) / 100

    // }

    req.body.finalPrice = req.body.price || product.price - (req.body.price || product.price * req.body.discount || product.discount || 0) / 100

    if (req.files?.mainImage.length) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.mainImage[0].path, { folder: `${process.env.APP_NAME}/product/${product.customId}/mainImage` })

        if (!secure_url) {
            return next(new Error("image not found", { cause: 400 }))

        }

        await cloudinary.uploader.destroy(product.mainImage.public_id)
        req.body.mainImage = { secure_url, public_id }

    }


    if (req.files?.supImage?.length) {
        for (const image of req.files.supImage) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.supImage[0].path, { folder: `${process.env.APP_NAME}/product/${product.customId}/subImage` })

            if (!secure_url) {
                return next(new Error("image not found", { cause: 400 }))

            }

            product.supImages.push({ secure_url, public_id })
        }

        req.body.supImages = product.supImages

    }

    req.body.updatedBy = req.user._id

    const update = await productModel.findByIdAndUpdate({ _id: productId }, req.body, { new: true })
    return res.status(200).json({ message: 'done', update })

})

//get all products

export const allProducts = asyncHandller(async(req, res, next)=>{
    const product = await productModel.find()

    return res.status(200).json({ message:"done", product})
})

export const productById = asyncHandller(async(req, res, next)=>{
    const {productId} = req.params
    const product = await productModel.findById(productId)

    return res.status(200).json({ message:"done", product})
})