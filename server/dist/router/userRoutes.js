"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const validateLogin_1 = require("../utils/validateLogin");
const userController_1 = require("../controller/userController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.route('/login').post(express_validator_1.body('email').isEmail(), express_validator_1.body('password').trim().isLength({ min: 5, max: 20 }).withMessage('must be at least 5 chars long'), validateLogin_1.validate, userController_1.userLogin);
router.route('/register').post(express_validator_1.body('email').isEmail().withMessage("not valid email "), express_validator_1.body('password').trim().isLength({ min: 5, max: 20 }).withMessage('must be at least 5 chars long'), validateLogin_1.validate, userController_1.userRegister);
router.route('/logout').post(auth_1.protect, userController_1.userLogout);
router.route('/post').get(auth_1.protect, userController_1.getMyPost);
router.route('/').get(auth_1.protect, userController_1.getMe)
    .post(auth_1.protect, userController_1.addFriends);
router.route('/:id').delete(auth_1.protect, userController_1.deleteUser);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map