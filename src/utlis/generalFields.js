import joi from 'joi'
import { idValidation } from '../middleware/validation.js'


export const generalFeilds = {

    email: joi.string().email({ tlds: { allow: ['net', 'com'] } }).required(),
    password: joi.string().pattern(new RegExp('^[a-zA=Z0-9]{3,30}$')).required(),
    _id: joi.string().custom(idValidation).required(),
    id: joi.string().custom(idValidation),
    token: joi.string().required(),
    title: joi.string().min(3).max(10).required(),
    details: joi.string().min(3).max(500).required(),
    taskStatus: joi.string().valid('toDo', 'doing', 'done').required(),
    file:joi.object({
        size: joi.number().positive().required(),
        path: joi.string().required(),
        filename: joi.string().required(),
        destination: joi.string().required(),
        mimetype: joi.string().required(),
        encoding: joi.string().required(),
        originalname: joi.string().required(),
        fieldname: joi.string().required(),
        // finalDest: joi.string().required(),

    })
    


}