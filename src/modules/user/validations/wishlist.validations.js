import Joi from 'joi'
import { schemas } from '../../../utils/schema.js'

export const updateWishlistSchema = Joi.object({
	body: {
		product_id: schemas.modelId.required(),
	},
	params: {},
	query: {},
})
