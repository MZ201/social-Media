"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const messageController_1 = require("../controller/messageController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.route('/').post(auth_1.protect, messageController_1.createMessage)
    .delete(auth_1.protect, messageController_1.deleteConversation)
    .get(auth_1.protect, messageController_1.getConversation);
router.route('/:id').delete(auth_1.protect, messageController_1.deleteMessage);
exports.default = router;
//# sourceMappingURL=messageRoutes.js.map