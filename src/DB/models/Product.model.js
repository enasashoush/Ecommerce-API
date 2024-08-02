import { Schema, Types, model } from "mongoose";

const productSchema = new Schema({

    name: {
        type: String,
        required: [true, 'name is required'],
        trim: true,
        lowercase: true,
        min:3,
        max: 30

    },
    mainImage: {
        type: Object,
        required: [true, 'image is required']
    },
    supImages: [{
        type: Object,
    }],
    description: String,
    colors: [String],
    size: [String],
    price: {
        type: Number,
        required: [true, 'price is required'],
        min: 1
    },
    discount: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        required: [true, 'stock is required'],
    },
    finalPrice: Number,
    slug: {
        type: String,
        required: [true, 'slug is required'],
        trim: true
    },
    createdBy: {
        type: Types.ObjectId,
        required: [true, 'createdBy id is required'],
        ref: 'User'
    },
    updatedBy: {
        type: Types.ObjectId,
        ref: 'User'
    },
    brandId: {
        type: Types.ObjectId,
        required: [true, 'brand is required'],
        ref: 'Brand'
    },
    categoryId: {
        type: Types.ObjectId,
        required: [true, 'categoryId is required'],
        ref: 'Category'
    },
    supCategoryId: {
        type: Types.ObjectId,
        required: [true, 'supCategoryId is required'],
        ref: 'SupCategory'
    },
    isDeleted:{
        type: Boolean,
        default: false
    },
    customId:{
        type: String,
        required:[true, 'customId is required'],
    }

},
    {
        timestamps: true
    })

const productModel = model('Product', productSchema)

export default productModel