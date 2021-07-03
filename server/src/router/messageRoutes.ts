import express from 'express'
import {
    createMessage, deleteConversation,
    deleteMessage, getConversation
} from '../controller/messageController'
import { protect } from '../middleware/auth'


const router = express.Router()

router.route('/').post(protect, createMessage)
    .delete(protect, deleteConversation)
    .get(protect, getConversation)

router.route('/:id').delete(protect, deleteMessage)


export default router