import jwt from 'jsonwebtoken'
import userModel from '../DB/models/User.model.js'

export const roles = {
    Admin: 'Admin',
    User:'User'
}

const authen = (role = Object.values(roles))=>{
   return async (req, res, next) => {
   
           const { auth } = req.headers
   
           if (!auth.startsWith(process.env.BEARER_KEY)) {
               return next(new Error('invalid baerer key', { cause: 400 }))
       
       
           }
   
           const token = auth.split(process.env.BEARER_KEY)[1]
   
           if (!token) {
               return next(new Error('invalid token', { cause: 400 }))
   
           }
   
               
           const payload = jwt.verify(token, process.env.AUTH_SIGNATURE)
       
           if (!payload?.id) {
               return next(new Error('invalid payload', { cause: 404 }))
       
       
           }
   
       
           if (!auth) {
               return next(new Error('please login', { cause: 401 }))
       
           }
       
   
   
       
           const user = await userModel.findOne({ _id: payload.id }).select('-password')
       
           if (!user) {
               return next(new Error('no register account', { cause: 404 }))
           }
   
           if(!role.includes(user.role)){

            return next(new Error('not authorized', { cause:401}))
   
           }

           if(user.status != 'Online'){

            return next(new Error('invaild token please login', { cause: 400 }))


           }
       
           if (user.isDeleted == true) {
               return next(new Error('email is deleted please login again'))
           }
       
           req.user = user
           return next()
       
       }
   
} 

export default authen