import Joi from 'joi'

const modelId = Joi.string().hex().length(24)
const phone=Joi.string().pattern(/^01[0125][0-9]{8}$/)

export const schemas = {
	modelId,
	phone
}
