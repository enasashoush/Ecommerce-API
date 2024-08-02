import mongoose, { Types } from "mongoose";
const { Schema } = mongoose;
const couponSchema = new Schema(
	{
		name: {
			type: String,
			unique: [true, "name must be a unique value"],
			trim: true,
			required: [true, "name must be a required value"],
			lowercase: true

		},
		amount:{
			type:Number,
			required: [true, "amount must be a required value"],
		},
		image: {
			type: Object,
		},
		createdBy:{
			type: Types.ObjectId,
			required: [true , 'name is required'], 
			ref: 'User'
		},
		updatedBy:{
			type: Types.ObjectId,
			ref: 'User'
		},
		expireIn:{
			type: Date,
			required: true
		},
		usedBy:[{
			type:Types.ObjectId,
			ref:'User'
		}],
		// isDeleted: {
		// 	type: Boolean,
		// 	default: false,
		// },
	},
	{ timestamps: true,
   },
);

const couponModel = mongoose.model("Coupon", couponSchema);

export default couponModel;