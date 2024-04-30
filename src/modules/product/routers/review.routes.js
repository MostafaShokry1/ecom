import { Router } from 'express'
import { validate } from '../../../middlewares/validation.middleware.js'
import {
	addReview,
	deleteReview,
	getReviews,
	updateReview,
} from '../controllers/review.controller.js'
import {
	addReviewSchema,
	deleteReviewSchema,
	getReviewSchema,
	updateReviewSchema,
} from '../validations/review.validations.js'
import { authenticate, authorize } from '../../auth/auth.middlewares.js'
import { ROLES } from '../../../utils/enums.js'

const router = Router({ mergeParams: true })

router
	.route('/')
	.get(validate(getReviewSchema), getReviews)
	.post(
		authenticate,
		authorize(ROLES.USER),
		validate(addReviewSchema),
		addReview
	)
	.put(
		authenticate,
		authorize(ROLES.USER),
		validate(updateReviewSchema),
		updateReview
	)
	.delete(
		authenticate,
		authorize(ROLES.USER),
		validate(deleteReviewSchema),
		deleteReview
	)

export default router
