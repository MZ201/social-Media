"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const statusController_1 = require("../controller/statusController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.route('/').post(auth_1.protect, statusController_1.addStatus).get(auth_1.protect, statusController_1.getStatus);
router.route('/user').get(auth_1.protect, statusController_1.getMyStatus);
router.route('/:id').delete(auth_1.protect, statusController_1.deleteStatus)
    .post(auth_1.protect, statusController_1.addSeen)
    .get(auth_1.protect, statusController_1.getVisitor);
exports.default = router;
//# sourceMappingURL=statusRoutes.js.map