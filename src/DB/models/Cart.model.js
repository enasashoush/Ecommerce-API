import { Schema, Types, model } from "mongoose";

const cartSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        required: true,
        ref: 'User',
        unique: true
    },
    products: [
        {
            productId: {
                type: Types.ObjectId,
                required: true,
                ref: 'Product',
                unique: true

            },
            quantity:{
                type:Number,
                required: true,
                min:1



            }
        }
    ]


}, {
    timeseries: true
})

const cartModel = model('Cart', cartSchema)

export default cartModel