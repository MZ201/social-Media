import express from "express"
import { body } from "express-validator"
import { validate } from "../utils/validateLogin"
import { addFriends, deleteUser, getMe, getMyPost, userLogin, userLogout, userRegister } from "../controller/userController"
import { protect } from "../middleware/auth"
const router = express.Router()

router.route('/login').post(body('email').isEmail(),
    body('password').trim().isLength({ min: 5, max: 20 }).withMessage('must be at least 5 chars long')
    , validate, userLogin)

router.route('/register').post(body('email').isEmail().withMessage("not valid email "),
    body('password').trim().isLength({ min: 5, max: 20 }).withMessage('must be at least 5 chars long')
    , validate, userRegister)

router.route('/logout').post(protect, userLogout)

router.route('/post').get(protect, getMyPost)

router.route('/').get(protect, getMe)
    .post(protect , addFriends)


router.route('/:id').delete(protect, deleteUser)

export default router