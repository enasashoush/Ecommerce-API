import { Router } from "express";
import * as userController from "./controller/user.controller.js"
import authen from '../../middleware/auth.js'
const router = Router()

router.patch('/addToWishlist/:productId', 
authen(),
userController.addToWishlist)

router.patch('/removeFromWishlist/:productId', 
authen(),
userController.removeFromWishlist)

export default router