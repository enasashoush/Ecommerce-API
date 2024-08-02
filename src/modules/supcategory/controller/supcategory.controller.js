
import { asyncHandller } from './../../../utlis/asyncHandler.js';
import cloudinary from './../../../utlis/cloudinary.js';
import slugify from 'slugify';
import supCategoryModel from './../../../DB/models/Subcategory.model.js';
import categoryModel from '../../../DB/models/Category.model.js';


// create supCategory
export const createSupCategory = asyncHandller(async (req, res, next) => {
    const { categoryId } = req.params
    const {name}= req.body

    if (! await categoryModel.findById({_id: categoryId})) {
        return next( new Error("invalid supCategory id",{cause: 404}))

    }

    if (await supCategoryModel.findOne({ name })) {
        return next( new Error("name already exists",{cause: 409}))

    }

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/category/${categoryId}/supCategories` })

    if (!secure_url) {
        return next( new Error("image not found",{cause: 400}))

    }

    req.body.image = { public_id, secure_url }
    req.body.slug = slugify(`${name}`)
    req.body.categoryId = categoryId
    req.body.createdBy = req.user._id


    const supCategory = await supCategoryModel.create(req.body)

    return res.status(201).json({ message: "Done", supCategory })
})


// get All supCategories
export const getAllSupCategory = asyncHandller(async (req, res, next) => {

    const {categoryId} = req.params
    const supCategories = await supCategoryModel.find({categoryId}).populate([
        {
            path: "categoryId"
        }
    ])

    return res.status(200).json({ message: "done", supCategories })

})


// get supCategory by ID
export const getIdSupCategory = asyncHandller(async (req, res, next) => {
    const { supCategoryId } = req.params

    const supCategory = await supCategoryModel.findById({ _id: supCategoryId }).populate([
        {
            path: "categoryId"
        }
    ])

    return res.status(200).json({ message: "done", supCategory })

})


// update supCategory
export const updateSupCategory = asyncHandller(async (req, res, next) => {

    const { supCategoryId} = req.params
    const SupCategoryExists = await supCategoryModel.findById({_id : supCategoryId})
     
    if(!SupCategoryExists){
        return next( new Error("invalid supCategory id",{cause: 404}))
    }

 
    if(req.body.name){
        if(await supCategoryModel.findOne({name: req.body.name})){
            return next( new Error("name already exist",{cause: 409}))

        }

        req.body.slug = slugify(req.body.name)
    }

    if (req.file){
        const { secure_url, public_id}= await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/category/${req.params.categoryId}/supCategory`})

        if(!secure_url){
            return next( new Error("image not found",{cause: 400}))

        }

        await cloudinary.uploader.destroy(SupCategoryExists.image.public_id)
        req.body.image = {public_id, secure_url}
    }

    req.body.updatedBy = req.user._id

    const newSupCategory = await supCategoryModel.findByIdAndUpdate({_id: supCategoryId}, req.body, { new: true})

    return res.status(200).json({message:"done", category: newSupCategory})

}

)