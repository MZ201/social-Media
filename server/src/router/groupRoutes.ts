import express from 'express'
import {
    addGroup, deleteGroup, getGroup, updateGroup
    , addToGroup, deleteFromGroup, allowPost, denyPost, getGroupPost
} from '../controller/groupController'
import { protect } from '../middleware/auth'


const router = express.Router()

router.route('/').post(protect, addGroup)



router.route('/:id/user').put(protect, addToGroup)
    .delete(protect, deleteFromGroup)

router.route('/:id/post').put(protect, allowPost)
    .delete(protect, denyPost)
    .get(protect, getGroupPost)

router.route('/:id').delete(protect, deleteGroup)
    .put(protect, updateGroup)
    .get(protect, getGroup)




export default router