import { Router } from 'express'

import categoriesRouter from '../modules/product/routers/category.routes.js'
import productsRouter from '../modules/product/routers/product.routes.js'
import couponsRouter from '../modules/coupon/routers/coupon.routes.js'
import brandsRouter from '../modules/product/routers/brand.routes.js'
import usersRouter from '../modules/user/routers/user.routes.js'
import cartsRouter from '../modules/cart/routers/cart.routes.js'
import ordersRouter from '../modules/cart/routers/order.routes.js'
import authRouter from '../modules/auth/auth.routes.js'

const router = Router()

router.use('/categories', categoriesRouter)
router.use('/products', productsRouter)
router.use('/brands', brandsRouter)
router.use('/users', usersRouter)
router.use('/coupons', couponsRouter)
router.use('/cart', cartsRouter)
router.use('/orders', ordersRouter)
router.use('/auth', authRouter)

export default router
