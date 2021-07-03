"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pageController_1 = require("../controller/pageController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.route('/').post(auth_1.protect, pageController_1.createPage);
router.route('/:id/post').get(auth_1.protect, pageController_1.getPagePost);
router.route('/:id/like').put(auth_1.protect, pageController_1.likePage);
router.route('/:id/dislike').put(auth_1.protect, pageController_1.dislikePage);
router.route('/:id').delete(auth_1.protect, pageController_1.deletePage)
    .put(auth_1.protect, pageController_1.updatePage)
    .get(auth_1.protect, pageController_1.getPage);
exports.default = router;
//# sourceMappingURL=pageRoutes.js.map