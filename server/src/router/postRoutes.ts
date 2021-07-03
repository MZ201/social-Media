import express from 'express'
import {
	addPost, deletePost, cancelShare,
	getGroupsPost, getPost, getVideoPost,
	numberOfInteractionOfPost, sharePost
} from '../controller/postController'
import { protect } from '../middleware/auth'

const router = express.Router()


router.route('/statistic/:id').get(protect, numberOfInteractionOfPost)


router.route('/share').post(protect, sharePost)
	.delete(protect, cancelShare)

router.route('/video').get(protect, getVideoPost)

router.route('/group').get(protect, getGroupsPost)

router.route('/').post(protect, addPost).get(protect, getPost)

router.route('/:id').delete(protect, deletePost)


export default router