import { Types } from "mongoose";

export const validation = (schema, includesToken = false) => {
    return (req, res, next) => {
        try {
            let methods = { ...req.body, ...req.query, ...req.params }

            if(req.file){
                methods.file = req.file

            }
            if(req.files){
                methods.files = req.files

            }
            if (req.headers.auth && includesToken) {
                methods = {  auth: req.headers.auth }

            } 
            // else {
            //     methods = { ...req.body, ...req.query, ...req.params }

            // } 
            {
                {
                    file:{

                    }
                }
            }

            const validationResult = schema.validate(methods, { abortEarly: false });



            if (validationResult?.error) {

                req.validationResult = validationResult.error
                return next(new Error('validation error', { cause: 403 }));
            }

            next()

        } catch (error) {

            return res.status(500).json({
                message: error.message, stack: error.stack

            });

        }

    }
}

export const idValidation = (value, helper) => {
    return Types.ObjectId.isValid(value) ? true : helper.message('invalid id');
}

