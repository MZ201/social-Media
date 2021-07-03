import express from 'express'
import {
    createPage, deletePage, dislikePage,
    getPage, likePage, updatePage , getPagePost
} from '../controller/pageController'
import { protect } from '../middleware/auth'


const router = express.Router()

router.route('/').post(protect, createPage)

router.route('/:id/post').get(protect , getPagePost)

router.route('/:id/like').put(protect, likePage)

router.route('/:id/dislike').put(protect, dislikePage)

router.route('/:id').delete(protect, deletePage)
    .put(protect, updatePage)
    .get(protect, getPage)
export default router