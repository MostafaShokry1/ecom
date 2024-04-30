import { Router } from 'express'
import { authenticate, authorize } from '../../auth/auth.middlewares.js'
import { ROLES } from '../../../utils/enums.js'
import {
	getAllUsers,
	getUser,
	updateUser,
} from '../controllers/user.controller.js'
import {
	getWishlist,
	updateWishlist,
} from '../controllers/wishlist.controller.js'
import { validate } from '../../../middlewares/validation.middleware.js'
import { updateWishlistSchema } from '../validations/wishlist.validations.js'

const router = Router()

router
	.route('/')
	.get(authenticate, authorize(ROLES.USER), getUser)
	.put(authenticate, authorize(ROLES.USER), updateUser)

router.route('/all').get(authenticate, authorize(ROLES.ADMIN), getAllUsers)

router
	.route('/wishlist')
	.get(authenticate, authorize(ROLES.USER), getWishlist)
	.put(
		authenticate,
		authorize(ROLES.USER),
		validate(updateWishlistSchema),
		updateWishlist
	)

export default router
