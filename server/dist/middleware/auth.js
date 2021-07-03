"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Users_1 = require("../entity/Users");
const typeorm_1 = require("typeorm");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const notAuthorizedError_1 = require("../error/notAuthorizedError");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const badRequestError_1 = require("../error/badRequestError");
exports.protect = express_async_handler_1.default((req, _, next) => __awaiter(this, void 0, void 0, function* () {
    if (!req.session || !req.session.jwt) {
        throw new notAuthorizedError_1.notAuthorizedError();
    }
    const decoded = jsonwebtoken_1.default.verify(req.session.jwt, process.env.JWT_KEY);
    try {
        req.currentUser = yield typeorm_1.getRepository(Users_1.Users)
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.friends', 'friends')
            .leftJoinAndSelect('user.groupMember', 'member')
            .leftJoinAndSelect('user.page', 'page')
            .where('user.id = :id', { id: decoded.id })
            .getOne();
    }
    catch (err) {
        throw new badRequestError_1.BadRequestError('something wrong in the seesionID');
    }
    next();
    return;
}));
//# sourceMappingURL=auth.js.map