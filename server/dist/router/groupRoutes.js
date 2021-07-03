"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const groupController_1 = require("../controller/groupController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.route('/').post(auth_1.protect, groupController_1.addGroup);
router.route('/:id/user').put(auth_1.protect, groupController_1.addToGroup)
    .delete(auth_1.protect, groupController_1.deleteFromGroup);
router.route('/:id/post').put(auth_1.protect, groupController_1.allowPost)
    .delete(auth_1.protect, groupController_1.denyPost)
    .get(auth_1.protect, groupController_1.getGroupPost);
router.route('/:id').delete(auth_1.protect, groupController_1.deleteGroup)
    .put(auth_1.protect, groupController_1.updateGroup)
    .get(auth_1.protect, groupController_1.getGroup);
exports.default = router;
//# sourceMappingURL=groupRoutes.js.map