import { Router } from 'express'
import { authenticate, authorize } from '../../auth/auth.middlewares.js'
import { ROLES } from '../../../utils/enums.js'
import { validate } from '../../../middlewares/validation.middleware.js'
import {
	addCoupon,
	deleteCoupon,
	getAllCoupons,
	getCoupon,
	updateCoupon,
} from '../controllers/coupon.controller.js'
import {
	addCouponSchema,
	deleteCouponSchema,
	getCouponSchema,
	updateCouponSchema,
} from '../validations/coupon.validations.js'

const router = Router()

router
	.route('/')
	.get(
		// authenticate, authorize(ROLES.ADMIN),
		getAllCoupons
	)
	.post(
		// authenticate,
		// authorize(ROLES.ADMIN),
		validate(addCouponSchema),
		addCoupon
	)

router
	.route('/:couponId')
	.get(
		authenticate,
		authorize(ROLES.ADMIN),
		validate(getCouponSchema),
		getCoupon
	)
	.put(
		authenticate,
		authorize(ROLES.ADMIN),
		validate(updateCouponSchema),
		updateCoupon
	)
	.delete(
		authenticate,
		authorize(ROLES.ADMIN),
		validate(deleteCouponSchema),
		deleteCoupon
	)

export default router
