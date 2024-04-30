import { Router } from 'express'
import { validate } from '../../../middlewares/validation.middleware.js'
import {
	addBrand,
	deleteBrand,
	getBrand,
	getBrands,
	updateBrand,
} from '../controllers/brand.controller.js'
import {
	addBrandSchema,
	deleteBrandSchema,
	getBrandSchema,
	updateBrandSchema,
} from '../validations/brand.validations.js'
import { upload } from '../../../middlewares/upload.middleware.js'
import { attachImage } from '../../image/middlewares/image.middleware.js'

const router = Router()

router
	.route('/')
	.get(getBrands)
	.post(
		upload.single('logo'),
		validate(addBrandSchema),
		attachImage('logo'),
		addBrand
	)

router
	.route('/:brandSlug')
	.get(validate(getBrandSchema), getBrand)
	.put(
		upload.single('logo'),
		validate(updateBrandSchema),
		attachImage('logo'),
		updateBrand
	)
	.delete(validate(deleteBrandSchema), deleteBrand)

export default router
