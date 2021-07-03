"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const interactController_1 = require("../controller/interactController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.route('/').post(auth_1.protect, interactController_1.addInteraction);
router.route('/recepient').get(auth_1.protect, interactController_1.asRecepientInteraction);
router.route('/sender').get(auth_1.protect, interactController_1.asSenderInteraction);
router.route('/:id').delete(auth_1.protect, interactController_1.removeInteraction)
    .get(auth_1.protect, interactController_1.getInteraction)
    .put(auth_1.protect, interactController_1.confirmInteraction);
exports.default = router;
//# sourceMappingURL=interactRoutes.js.map