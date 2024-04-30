import { catchAsyncError } from '../../../utils/error.handler.js'
import { makeImage } from '../utils/image.utils.js'

export const attachImage = (fieldName) =>
	catchAsyncError(async (req, res, next) => {
		if (!req.file) return next()
		const image = await makeImage(req.file.path)
		req.body[fieldName] = image._id
		next()
	})
