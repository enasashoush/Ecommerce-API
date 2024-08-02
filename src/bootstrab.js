import connection from './DB/connection.js';
import categotyRouter from './modules/category/category.router.js'
import supCategoryRouter from './modules/supcategory/supcategory.router.js'
import couponRouter from './modules/coupon/coupon.router.js'
import brandRouter from './modules/brand/brand.router.js'
import authRouter from './modules/auth/auth.router.js'
import productRouter from './modules/product/product.router.js'
import cartRouter from './modules/cart/cart.router.js'
import orderRouter from './modules/order/order.router.js'
import userRouter from './modules/user/user.router.js'
import { globalError } from './utlis/asyncHandler.js';

const bootstrap = (app, express) => {

    app.use(express.json());
    app.use('/category', categotyRouter);
    app.use('/subCategory', supCategoryRouter);
    app.use('/coupon', couponRouter);
    app.use('/brand', brandRouter);
    app.use('/auth', authRouter);
    app.use('/product', productRouter);
    app.use('/cart', cartRouter);
    app.use('/order', orderRouter);
    app.use('/user', userRouter);

    app.use(globalError);
    connection()
}

export default bootstrap;