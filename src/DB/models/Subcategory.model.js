import { Schema, Types, model } from "mongoose";

const subCategorySchema = new Schema({

  name: {
    type: String,
    required: [true, 'name is required'],
    trim: true,
    unique: [true, 'name is unique '],
    lowercase: true

  },
  image: {
    type: Object,
    required: [true, 'image is required']
  },
  slug: {
    type: String,
    required: [true, 'slug is required'],
    unique: [true, 'slug must be unique'],
    trim: true
  },
  createdBy: {
    type: Types.ObjectId,
    required: [false, 'createdBy id is required'],  // make it true
    ref: 'User'
  },
  updatedBy: {
    type: Types.ObjectId,
    ref: 'User'
  },
  categoryId: {
    type: Types.ObjectId,
    required: [true, 'categoryId is required'],
    ref: 'Category'
  }

},
  {
    timestamps: true
  })

const supCategoryModel = model('SubCategory', subCategorySchema)

export default supCategoryModel