import { Router } from 'express'
import { validate } from '../../../middlewares/validation.middleware.js'
import {
	addSubcategorySchema,
	deleteSubcategorySchema,
	getSubcategoriesSchema,
	getSubcategorySchema,
	updateSubcategorySchema,
} from '../validations/subcategory.validations.js'
import {
	addSubcategory,
	deleteSubcategory,
	getSubcategories,
	getSubcategory,
	updateSubcategory,
} from '../controllers/subcategory.controller.js'

const router = Router({ mergeParams: true })

router
	.route('/')
	.get(validate(getSubcategoriesSchema), getSubcategories)
	.post(validate(addSubcategorySchema), addSubcategory)

router
	.route('/:subcategorySlug')
	.get(validate(getSubcategorySchema), getSubcategory)
	.put(validate(updateSubcategorySchema), updateSubcategory)
	.delete(validate(deleteSubcategorySchema), deleteSubcategory)

export default router
