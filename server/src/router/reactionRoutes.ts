import express from 'express'
import {
    addReaction,
    deleteReaction,
    getReaction,
    updateReaction,

} from '../controller/reactionController'
import { protect } from '../middleware/auth'


const router = express.Router()

router.route('/')
    .post(protect, addReaction)
    .get(protect, getReaction)


router.route('/:id').put(protect, updateReaction)
    .delete(protect , deleteReaction)

export default router