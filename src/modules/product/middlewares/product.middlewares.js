import { catchAsyncError } from '../../../utils/error.handler.js'
import { makeImage } from '../../image/utils/image.utils.js'

export const attachCoverImage = () =>
	catchAsyncError(async (req, res, next) => {
		if (!req.files?.cover_image) return next()
		const image = await makeImage(req.files.cover_image[0].path)
		req.body.cover_image = image._id
		next()
	})
