import mongoose, { Types } from "mongoose";

const { Schema } = mongoose;

const brandSchema = new Schema(
	{
		name: {
			type: String,
			unique: [true, "name must be a unique value"],
			trim: true,
			required: [true, "name must be a required value"],
			lowercase: true

		},
		slug: {
			type: String,
			unique: [true, "slug must be a unique value"],
			required: [true, "slug is required"],
		},
		image: {
			type: Object,
			required: [true, "image is required"],
		},
		createdBy:{
			type: Types.ObjectId,
			required: [false , 'name is required'], // make it true
			ref: 'User'
		},
		updatedBy:{
			type: Types.ObjectId,
			ref: 'User'
		}
		// isDeleted: {
		// 	type: Boolean,
		// 	default: false,
		// },
	},
	{ timestamps: true,

   },
);


const brandModel = mongoose.model("Brand", brandSchema);

export default brandModel;
