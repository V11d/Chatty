import express from 'express'
import { login, logout, signup, update_profile, check_auth } from '../controllers/auth.controller.js'
import { is_logged_in } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)

router.put('/update-profile', is_logged_in, update_profile)

router.get('/check', is_logged_in, check_auth)

export default router