"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reactionController_1 = require("../controller/reactionController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.route('/')
    .post(auth_1.protect, reactionController_1.addReaction)
    .get(auth_1.protect, reactionController_1.getReaction);
router.route('/:id').put(auth_1.protect, reactionController_1.updateReaction)
    .delete(auth_1.protect, reactionController_1.deleteReaction);
exports.default = router;
//# sourceMappingURL=reactionRoutes.js.map