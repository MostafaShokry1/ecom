import { Router } from 'express'
import { validate } from '../../../middlewares/validation.middleware.js'
import { upload } from '../../../middlewares/upload.middleware.js'
import {
	addCategory,
	deleteCategory,
	getCategories,
	getCategory,
	updateCategory,
} from '../controllers/category.controller.js'
import {
	addCategorySchema,
	deleteCategorySchema,
	getCategorySchema,
	updateCategorySchema,
} from '../validations/category.validations.js'
import subcategoryRouter from './subcategory.routes.js'
import { attachImage } from '../../image/middlewares/image.middleware.js'

const router = Router()

router
	.route('/')
	.get(getCategories)
	.post(
		upload.single('image'),
		validate(addCategorySchema),
		attachImage('image'),
		addCategory
	)

router
	.route('/:categorySlug')
	.get(validate(getCategorySchema), getCategory)
	.put(
		upload.single('image'),
		validate(updateCategorySchema),
		attachImage('image'),
		updateCategory
	)
	.delete(validate(deleteCategorySchema), deleteCategory)

router.use('/:categorySlug/subcategories', subcategoryRouter)

export default router
