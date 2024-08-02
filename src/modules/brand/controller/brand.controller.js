
import { asyncHandller } from './../../../utlis/asyncHandler.js';
import cloudinary from './../../../utlis/cloudinary.js';
import slugify from 'slugify';
import brandModel from '../../../DB/models/Brand.model.js';


// create category
export const createBrand = asyncHandller(async (req, res, next) => {
    const { name } = req.body

    if (await brandModel.findOne({ name })) {
        return next( new Error("brand name already exists",{cause: 409}))

    }

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/brand` })

    if (!secure_url) {
        return next( new Error("image not found",{cause: 400}))

    }

    req.body.image = { public_id, secure_url }

    req.body.slug = slugify(`${name}`)

    req.body.createdBy = req.user._id


    const brand = await brandModel.create(req.body)

    return res.status(200).json({ message: "Done", brand })
})


// get All Categories
export const getAllBrands = asyncHandller(async (req, res, next) => {
    const brands = await brandModel.find()

    return res.status(200).json({ message: "done", brands })

})


// get Category by ID
export const getIdBrand = asyncHandller(async (req, res, next) => {
    const { brandId } = req.params

    const brand = await brandModel.findById({ _id: brandId })

    return res.status(200).json({ message: "done", brand })

})


// update category
export const updateBrand = asyncHandller(async (req, res, next) => {

    const { brandId} = req.params
    const brandExists = await brandModel.findById({_id : brandId})
     
    if(!brandExists){
        return next( new Error("invalid brand id",{cause: 404}))
    }


    if(req.body.name){
        if(await brandModel.findOne({name: req.body.name})){
            return next( new Error("brand name already exist",{cause: 409}))

        }

        req.body.slug = slugify(req.body.name)
    }

    if (req.file){
        const { secure_url, public_id}= await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/brand`})

        if(!secure_url){
            return next( new Error("image not found",{cause: 400}))

        }

        await cloudinary.uploader.destroy(brandExists.image.public_id)
        req.body.image = {public_id, secure_url}
    }

    req.body.updatedBy = req.user._id

    const newBrand = await brandModel.findByIdAndUpdate({_id: brandId}, req.body, { new: true})

    return res.status(200).json({message:"done", brand: newBrand})

}

)