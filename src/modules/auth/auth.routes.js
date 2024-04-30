import { Router } from 'express'
import { signin, signup, validateEmail } from './auth.controller.js'
import { assertUniqueEmail } from './auth.middlewares.js'
import { validate } from '../../middlewares/validation.middleware.js'
import {
	signinSchema,
	signupSchema,
	validateEmailSchema,
} from './auth.validate.js'

const router = Router()

router.post('/signin', validate(signinSchema), signin)
router.post('/signup', validate(signupSchema), assertUniqueEmail, signup)
router.get('/validate/:token', validate(validateEmailSchema), validateEmail)

export default router
