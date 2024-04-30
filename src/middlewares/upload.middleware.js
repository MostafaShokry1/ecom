import multer from 'multer'
import { AppError } from '../utils/error.handler.js'

const storage = multer.diskStorage({})

function fileFilter(req, file, cb) {
	if (!file.mimetype.startsWith('image'))
		return cb(new AppError('Images only!', 400), false)

	cb(null, true)
}

export const upload = multer({ storage, fileFilter })
