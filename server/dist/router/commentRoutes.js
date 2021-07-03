"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentController_1 = require("../controller/commentController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.route('/statistic/:id').get(auth_1.protect, commentController_1.numberOfInteractionOfComment);
router.route('/:id/count').get(auth_1.protect, commentController_1.countCommentOfPost);
router.route('/post/:id').get(auth_1.protect, commentController_1.getCommentOfPost);
router.route('/:id').delete(auth_1.protect, commentController_1.deleteComment)
    .get(auth_1.protect, commentController_1.getCommentOfComment)
    .post(auth_1.protect, commentController_1.addComment);
exports.default = router;
//# sourceMappingURL=commentRoutes.js.map