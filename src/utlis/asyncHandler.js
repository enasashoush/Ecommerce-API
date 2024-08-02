export const asyncHandller = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(error => {
            if (process.env.MOOD =='DEV'){
                return res.status(500).json({ message: error.message, stack: error.stack })

            }

            return res.status(500).json({ message: error.message})

            
        })
    }

}

export const globalError = (error, req, res, next) => {

    if (req.validationResult){
        return res.status(error.cause || 500).json({ globalMessage: error.message, details: req.validationResult.details })

    }
    
    if (process.env.MOOD =='DEV'){
        return res.status(error.cause || 500).json({ globalMessage: error.message, stack: error.stack })

    }

    console.error(error);
    return res.status(error.cause || 500).json({ globalMessage: error.message })

}