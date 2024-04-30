import { Router } from 'express'
import { validate } from '../../../middlewares/validation.middleware.js'
import { upload } from '../../../middlewares/upload.middleware.js'
import {
	addProductSchema,
	deleteProductSchema,
	getProductSchema,
	updateProductSchema,
} from '../validations/products.validations.js'
import {
	addProductWithImages,
	deleteProduct,
	getProduct,
	getProducts,
	updateProductWithImages,
} from '../controllers/product.controller.js'
import { attachCoverImage } from '../middlewares/product.middlewares.js'
import reviewRouter from './review.routes.js'

const router = Router()

router
	.route('/')
	.get(getProducts)
	.post(
		upload.fields([
			{ name: 'cover_image', maxCount: 1 },
			{ name: 'images', maxCount: 8 },
		]),
		validate(addProductSchema),
		attachCoverImage(),
		addProductWithImages
	)

router
	.route('/:productSlug')
	.get(validate(getProductSchema), getProduct)
	.put(
		upload.fields([
			{ name: 'cover_image', maxCount: 1 },
			{ name: 'images', maxCount: 8 },
		]),
		validate(updateProductSchema),
		attachCoverImage(),
		updateProductWithImages
	)
	.delete(validate(deleteProductSchema), deleteProduct)

router.use('/:productSlug/reviews', reviewRouter)

export default router
