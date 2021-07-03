"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postController_1 = require("../controller/postController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.route('/statistic/:id').get(auth_1.protect, postController_1.numberOfInteractionOfPost);
router.route('/share').post(auth_1.protect, postController_1.sharePost)
    .delete(auth_1.protect, postController_1.cancelShare);
router.route('/video').get(auth_1.protect, postController_1.getVideoPost);
router.route('/group').get(auth_1.protect, postController_1.getGroupsPost);
router.route('/').post(auth_1.protect, postController_1.addPost).get(auth_1.protect, postController_1.getPost);
router.route('/:id').delete(auth_1.protect, postController_1.deletePost);
exports.default = router;
//# sourceMappingURL=postRoutes.js.map