import{ Schema, Types, model } from "mongoose";

const userSchema = new Schema({

    userName: {
        type: String,
        required:[true, 'username is required'],
        min:[2, 'minimum length 2 characters'],
        max:[2, 'maximum length 20 characters'],

    },
    email: {
        type: String,
        unique: [true,' email must be unique'],
        required: [true,'email is required'],
        lowercase: true


    },
    password: {
        type: String,
        required: [true,'password is required'],


    },
    role: {
        type: String,
        default: 'User',
        enum: ['Admin', 'User']

    },
    confirmEmail:{

        type: Boolean,
        default: false
    },
    status:{
        type: String,
        default: 'Offline',
        enum: ['Offline', 'Online']

    },
    gender: {
        type: String,
        enum: ['female', 'male'],
        default: 'male',
        lowercase: true


    },
    code: String,
    age: Number,
    phone: String,
    address: String,
    image: String,
    DOB: String,
    isDeleted:{
        type:Boolean,
        default:false
    },
    wishlist:[
        {
            type: Types.ObjectId,
            ref: 'Product'
        }
    ]



}, {
    timestamps: true
})

const userModel = model("User", userSchema)


export default userModel

