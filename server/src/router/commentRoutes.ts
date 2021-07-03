import express from 'express'
import {
    addComment, countCommentOfPost, deleteComment, getCommentOfComment,
    getCommentOfPost, numberOfInteractionOfComment,
} from '../controller/commentController'
import { protect } from '../middleware/auth'


const router = express.Router()




router.route('/statistic/:id').get(protect, numberOfInteractionOfComment)

router.route('/:id/count').get(protect , countCommentOfPost)

router.route('/post/:id').get(protect , getCommentOfPost)

router.route('/:id').delete(protect, deleteComment)
    .get(protect, getCommentOfComment)
    .post(protect, addComment)


export default router