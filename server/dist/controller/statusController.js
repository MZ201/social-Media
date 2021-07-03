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
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const typeorm_1 = require("typeorm");
const badRequestError_1 = require("../error/badRequestError");
const Page_1 = require("../entity/Page");
const Group_1 = require("../entity/Group");
const Status_1 = require("../entity/Status");
const Users_1 = require("../entity/Users");
exports.addStatus = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    let { body, groupRoom, pageRoom } = req.body;
    let page, group;
    if (pageRoom) {
        page = yield typeorm_1.getRepository(Page_1.Page).findOne({
            id: Number(pageRoom)
        });
    }
    if (groupRoom) {
        group = yield typeorm_1.getRepository(Group_1.Group).findOne({
            id: Number(groupRoom)
        });
    }
    pageRoom = page ? page.id : null;
    groupRoom = group ? group.id : null;
    const createdStatus = yield typeorm_1.getRepository(Status_1.Status).create({
        body: body, creator: req.currentUser, pageRoom, groupRoom
    });
    yield typeorm_1.getRepository(Status_1.Status).save(createdStatus);
    req.app.get('io').to([...req.currentUser.friends.map(fr => `${fr.id}`)])
        .emit('statusCreated', createdStatus);
    res.json({});
}));
exports.deleteStatus = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    const deletedStatus = yield typeorm_1.getRepository(Status_1.Status).findOne({
        relations: ['creator'],
        where: [{ id: Number(req.params.id) }]
    });
    let group;
    if (req.query.group) {
        group = yield typeorm_1.getRepository(Group_1.Group)
            .createQueryBuilder('group')
            .leftJoinAndSelect('group.admin', 'admin')
            .leftJoinAndSelect('group.member', 'member')
            .where('group.id =:id', { id: req.query.group })
            .getOne();
    }
    let index = -1;
    if (group) {
        index = group.admin.findIndex(user => user.id == req.currentUser.id);
    }
    if (!deletedStatus || (req.currentUser.id !== deletedStatus.creator.id && index === -1)) {
        throw new badRequestError_1.BadRequestError('Post not Found');
    }
    yield typeorm_1.getRepository(Status_1.Status).delete([deletedStatus.id]);
    res.json({});
}));
exports.getStatus = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    const skip = Number(req.query.skip) || 0;
    let friends = req.currentUser.friends.map(friend => friend.id);
    if (friends.length === 0) {
        friends = [0];
    }
    let group = req.currentUser.groupMember.map(member => member.id);
    if (group.length === 0) {
        group = [0];
    }
    let page = req.currentUser.page.map(page => page.id);
    if (page.length === 0) {
        page = [0];
    }
    let status = [];
    let myStatus;
    try {
        status = yield typeorm_1.getRepository(Users_1.Users)
            .createQueryBuilder('users')
            .select(['users.id', 'users.name', 'users.image'])
            .leftJoinAndSelect('users.statusCreator', 'status')
            .leftJoinAndSelect('status.pageRoom', 'page')
            .leftJoinAndSelect('status.groupRoom', 'group')
            .leftJoinAndSelect('status.visitor', 'visitor')
            .orWhere('users.id IN (:...friends)', { friends: friends })
            .andWhere('status.creator = users.id ')
            .orWhere('page.id IN (:...page)', { page: page })
            .orWhere('group.id IN (:...group)', { group: group })
            .orderBy('status.createdAt', 'ASC')
            .take(10)
            .skip(10 * skip)
            .getMany();
        myStatus = skip === 0 ? yield typeorm_1.getRepository(Users_1.Users)
            .createQueryBuilder('users')
            .leftJoinAndSelect('users.statusCreator', 'status')
            .leftJoinAndSelect('status.pageRoom', 'page')
            .leftJoinAndSelect('status.groupRoom', 'group')
            .where('status.creator = :userID ', { userID: req.currentUser.id })
            .take(10)
            .skip(10 * skip)
            .orderBy('status.createdAt', 'ASC')
            .getOne() : null;
    }
    catch (err) {
        throw new badRequestError_1.BadRequestError(err.message);
    }
    status = status.map(Status => {
        Status.statusCreator.forEach((story) => {
            const index = story.visitor.findIndex(visitor => visitor.id === req.currentUser.id);
            story.visitor = index === -1 ? false : true;
        });
        return Status;
    });
    if (myStatus && myStatus.statusCreator.length > 0 && skip === 0) {
        status = [myStatus, ...status];
    }
    res.send({ status });
}));
exports.getMyStatus = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    const skip = Number(req.query.skip) || 0;
    let status;
    try {
        status = yield typeorm_1.getRepository(Users_1.Users)
            .createQueryBuilder('users')
            .leftJoinAndSelect('users.statusCreator', 'status')
            .leftJoinAndSelect('status.pageRoom', 'page')
            .leftJoinAndSelect('status.groupRoom', 'group')
            .where('status.creator = :userID ', { userID: req.currentUser.id })
            .take(10)
            .skip(10 * skip)
            .orderBy('status.createdAt', 'ASC')
            .getOne();
    }
    catch (err) {
        throw new badRequestError_1.BadRequestError('something wrong in query');
    }
    res.send({ status });
}));
exports.addSeen = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    let status;
    try {
        yield typeorm_1.getConnection()
            .createQueryBuilder()
            .relation(Status_1.Status, 'visitor')
            .of(req.params.id)
            .add(req.currentUser);
    }
    catch (err) {
        status = err.message;
    }
    res.send({
        status: status
    });
}));
exports.getVisitor = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    let status;
    try {
        status = yield typeorm_1.getRepository(Status_1.Status)
            .createQueryBuilder('status')
            .leftJoinAndSelect('status.visitor', 'visitor')
            .leftJoinAndSelect('status.creator', 'creator')
            .where('status.id = :statusID', { statusID: req.params.id })
            .andWhere('creator.id = :creatorID', { creatorID: req.currentUser.id })
            .getOne();
    }
    catch (err) {
        throw new badRequestError_1.BadRequestError(err.message);
    }
    if (!status) {
        throw new badRequestError_1.BadRequestError('something wrong happen');
    }
    res.send({
        visitor: status.visitor
    });
}));
//# sourceMappingURL=statusController.js.map