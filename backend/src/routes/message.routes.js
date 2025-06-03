import express from 'express'
import { is_logged_in } from '../middleware/auth.middleware.js'
import { get_all_messages, get_all_users, send_message } from '../controllers/message.controller.js'

const router = express.Router()

router.get('/users', is_logged_in, get_all_users)

router.get('/:id', is_logged_in, get_all_messages)

router.post('/send/:id', is_logged_in, send_message)

export default router