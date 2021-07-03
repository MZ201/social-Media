import express from 'express'
import {
    addInteraction, asRecepientInteraction, asSenderInteraction,
    confirmInteraction, getInteraction, removeInteraction
} from '../controller/interactController'
import { protect } from '../middleware/auth'


const router = express.Router()


router.route('/').post(protect, addInteraction)
    

router.route('/recepient').get(protect, asRecepientInteraction)
router.route('/sender').get(protect, asSenderInteraction)




router.route('/:id').delete(protect, removeInteraction)
    .get(protect, getInteraction)
    .put(protect, confirmInteraction)

export default router