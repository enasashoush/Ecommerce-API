import { asyncHandller } from './../../../utlis/asyncHandler.js';
import cloudinary from './../../../utlis/cloudinary.js';
import slugify from 'slugify';
import categoryModel from '../../../DB/models/Category.model.js';


// create category
export const createCategory = asyncHandller(async (req, res, next) => {
    const { name } = req.body

    if (await categoryModel.findOne({ name })) {
        return next( new Error("name already exists",{cause: 409}))

    }

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/category` })

    if (!secure_url) {
        return next( new Error("image not found",{cause: 400}))

    }

    req.body.image = {  secure_url, public_id }

    req.body.slug = slugify(`${name}`)

    req.body.createdBy = req.user._id

    const category = await categoryModel.create(req.body)

    return res.status(201).json({ message: "Done", category })
})


// get All Categories
export const getAllCategory = asyncHandller(async (req, res, next) => {
    const categories = await categoryModel.find().populate([
        {
            path: "subCategory"
        }
    ])

    return res.status(200).json({ message: "done", categories })

})


// get Category by ID
export const getIdCategory = asyncHandller(async (req, res, next) => {
    const { categoryId } = req.params

    const category = await categoryModel.findById({ _id: categoryId }).populate([
        {
            path: "subCategory"
        }
    ]) 

    return res.status(200).json({ message: "done", category })

})


// update category
export const updateCategory = asyncHandller(async (req, res, next) => {

    const { categoryId} = req.params
    const categoryExists = await categoryModel.findById({_id : categoryId})
     
    if(!categoryExists){
        return next( new Error("invalid category id",{cause: 404}))
    }


    if(req.body.name){
        if(await categoryModel.findOne({name: req.body.name})){
            return next( new Error("name already exist",{cause: 409}))

        }

        req.body.slug = slugify(req.body.name)
    }

    if (req.file){
        const { secure_url, public_id}= await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/category`})

        if(!secure_url){
            return next( new Error("image not found",{cause: 400}))

        }

        await cloudinary.uploader.destroy(categoryExists.image.public_id)
        req.body.image = {public_id, secure_url}
    }


    req.body.updatedBy = req.user._id

    const newCategory = await categoryModel.findByIdAndUpdate({_id: categoryId}, req.body, { new: true})

    return res.status(200).json({message:"done", category: newCategory})

}

)