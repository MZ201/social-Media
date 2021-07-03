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
const passwordManager_1 = require("../utils/passwordManager");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const badRequestError_1 = require("../error/badRequestError");
const Post_1 = require("../entity/Post");
const Interact_1 = require("../entity/Interact");
exports.userLogin = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    const { email, password } = req.body;
    const exsistedUser = yield typeorm_1.getRepository(Users_1.Users)
        .createQueryBuilder('user')
        .where('email =:email', { email: email })
        .select('user')
        .addSelect('user.password')
        .getOne();
    if (!exsistedUser || (yield passwordManager_1.Password.compare(exsistedUser.password, password)) === false) {
        throw new badRequestError_1.BadRequestError("entry is wrong");
    }
    const userJwt = jsonwebtoken_1.default.sign({
        id: exsistedUser.id
    }, process.env.JWT_KEY);
    req.session = {
        jwt: userJwt
    };
    return res.send(exsistedUser);
}));
exports.userRegister = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    let { name, email, phoneNumber, password } = req.body;
    const exsistedUser = yield typeorm_1.getRepository(Users_1.Users).findOne({ email });
    if (exsistedUser) {
        throw new badRequestError_1.BadRequestError('email in use', "email");
    }
    password = yield passwordManager_1.Password.toHash(password);
    const createdUser = yield typeorm_1.getRepository(Users_1.Users).create({ name, email, phoneNumber, password });
    yield typeorm_1.getRepository(Users_1.Users).save(createdUser);
    return res.send({ createdUser });
}));
exports.userLogout = express_async_handler_1.default((req, res) => {
    req.session = null;
    res.send({});
});
exports.deleteUser = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const deletedUser = yield typeorm_1.getRepository(Users_1.Users).findOne({ id });
    if (deletedUser) {
        yield typeorm_1.getRepository(Users_1.Users).remove(deletedUser);
    }
    else {
        res.status(400);
        throw new badRequestError_1.BadRequestError("User not Found");
    }
    res.send({});
}));
exports.getMe = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    res.send({ user: req.currentUser });
}));
exports.addFriends = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    const { userID } = req.body;
    const confirm = yield typeorm_1.getRepository(Interact_1.Interact)
        .createQueryBuilder('interact')
        .leftJoinAndSelect('interact.sender', 'sender')
        .leftJoinAndSelect('interact.recepient', 'recepient')
        .where('sender.id =:senderID', { senderID: userID })
        .andWhere('recepient.id =:recepientID', { recepientID: req.currentUser.id })
        .andWhere('interact.action = :action', { action: Interact_1.action.friendship })
        .getOne();
    if (!confirm) {
        throw new badRequestError_1.BadRequestError('no Demand for drandship');
    }
    const you = yield typeorm_1.getRepository(Users_1.Users)
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.friends', 'friends')
        .where('user.id =:id', { id: userID })
        .getOne();
    if (!you) {
        throw new badRequestError_1.BadRequestError('no user Found');
    }
    you.friends.push(req.currentUser);
    req.currentUser.friends.push(you);
    yield typeorm_1.getManager().transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
        yield transactionalEntityManager.save(you);
        yield transactionalEntityManager.save(req.currentUser);
        yield transactionalEntityManager.remove(confirm);
    }));
    res.send({});
}));
exports.getMyPost = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    const { skip } = req.body;
    const myPost = yield typeorm_1.getRepository(Post_1.Post)
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.creator', 'creator')
        .leftJoin('post.share', 'share')
        .where('creator.id =:id', { id: req.currentUser.id })
        .orWhere('share.id = :userID', { userID: req.currentUser.id })
        .take(10)
        .skip(10 * skip)
        .getMany();
    res.send({ myPost });
}));
//# sourceMappingURL=userController.js.map