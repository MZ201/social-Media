import express from 'express'
import { addSeen, addStatus, deleteStatus  , getMyStatus, getStatus, getVisitor} from '../controller/statusController'
import { protect } from '../middleware/auth'

const router = express.Router()

router.route('/').post(protect , addStatus).get(protect , getStatus)

router.route('/user' ).get(protect , getMyStatus)

router.route('/:id').delete(protect , deleteStatus)
    .post(protect , addSeen)
    .get(protect , getVisitor)


export default router