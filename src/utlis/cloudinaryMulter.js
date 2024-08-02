import multer from 'multer'


export const fileValidation = {
    image: ['image/png', 'image/jpeg', 'image/gif'],
    pdf: ['application/pdf', 'application/msword'],
    video: ['video/mp4'],

}

export function uploadFile (customValidation= {}){

    const storage = multer.diskStorage({ })

    const fileFilter = (req, file, cb) => {
        if (customValidation.includes(file.mimetype)) {
            cb(null, true)

        } else {
            cb(new Error('Invalid format'), false)
        }
    }

    const upload = multer({ fileFilter, storage })

    return upload
}

