import { Router } from 'express'
import { checkIsEmailVerified, forgotPassword, handlePassword, resetPassword, signin, signup, validateEmail } from './auth.controller.js'
import { assertUniqueEmail } from './auth.middlewares.js'
import { validate } from '../../middlewares/validation.middleware.js'
import {
	signinSchema,
	signupSchema,
	validateEmailForgotSchema,
	validateEmailResetSchema,
	validateEmailSchema,
} from './auth.validate.js'

const router = Router()

router.post('/signin', validate(signinSchema), signin)
router.post('/signup', validate(signupSchema), assertUniqueEmail, signup)
router.get('/validate/:token', validate(validateEmailSchema), validateEmail)
router.get('/verifiy/:token', validate(validateEmailSchema), checkIsEmailVerified)
router.post('/forgotpassword', validate(validateEmailForgotSchema), forgotPassword)
router.get('/reset-password/:token', validate(validateEmailResetSchema), resetPassword)
router.post('/handlePassword/:token',handlePassword)


export default router