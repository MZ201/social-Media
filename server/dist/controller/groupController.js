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
const Group_1 = require("../entity/Group");
const typeorm_1 = require("typeorm");
const badRequestError_1 = require("../error/badRequestError");
const Post_1 = require("../entity/Post");
const Comment_1 = require("../entity/Comment");
const Users_1 = require("../entity/Users");
exports.addGroup = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    const { name } = req.body;
    const createdGroup = yield typeorm_1.getRepository(Group_1.Group).create({
        name, admin: [req.currentUser]
    });
    yield typeorm_1.getRepository(Group_1.Group).save(createdGroup);
    res.send({ createdGroup });
}));
exports.deleteGroup = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    const deletedGroup = yield typeorm_1.getRepository(Group_1.Group)
        .createQueryBuilder('group')
        .leftJoinAndSelect('group.admin', 'admin')
        .where('group.id =:id', { id: Number(req.params.id) })
        .getOne();
    if (!deletedGroup) {
        throw new badRequestError_1.BadRequestError('no Group  Exsist');
    }
    const index = deletedGroup.admin.findIndex(admin => admin.id == req.currentUser.id);
    if (index === -1) {
        throw new badRequestError_1.BadRequestError('No group Found');
    }
    let posts;
    posts = yield typeorm_1.getRepository(Post_1.Post)
        .createQueryBuilder('post')
        .innerJoinAndSelect('post.groupRoom', 'group')
        .where('post.groupRoom = :id', { id: Number(req.params.id) })
        .select('post')
        .addSelect('group.name')
        .getMany();
    let search = '';
    posts.forEach((post, index) => {
        search += post.id;
        if (index != posts.length - 1) {
            search += ',';
        }
    });
    if (posts.length > 0) {
        const comment = yield typeorm_1.getRepository(Comment_1.Comment)
            .createQueryBuilder('comment')
            .innerJoin('comment.post', 'post')
            .where(`comment.post IN (${search})`)
            .getMany();
        typeorm_1.getRepository(Comment_1.Comment).remove(comment);
    }
    typeorm_1.getRepository(Post_1.Post).remove(posts);
    typeorm_1.getRepository(Group_1.Group).remove(deletedGroup);
    res.send({});
}));
exports.updateGroup = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    const { name, body } = req.body;
    let change = {};
    if (name) {
        change = Object.assign({}, change, { name });
    }
    if (body) {
        change = Object.assign({}, change, { body });
    }
    const update = yield typeorm_1.getConnection()
        .createQueryBuilder()
        .update(Group_1.Group)
        .set(change)
        .where("id = :id", { id: req.params.id })
        .execute();
    if (update.affected === 0) {
        throw new badRequestError_1.BadRequestError('Group not Found');
    }
    res.send({});
}));
exports.getGroup = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    const existedGroup = yield typeorm_1.getRepository(Group_1.Group)
        .createQueryBuilder('group')
        .leftJoinAndSelect('group.admin', 'admin')
        .leftJoinAndSelect('group.member', 'member')
        .where('group.id =:id', { id: Number(req.params.id) })
        .select('group')
        .addSelect('member.name')
        .addSelect('admin.name')
        .getOne();
    if (!existedGroup) {
        throw new badRequestError_1.BadRequestError('Group not Found');
    }
    res.send({ existedGroup });
}));
exports.addToGroup = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    const { memberID, adminID } = req.body;
    const existedGroup = yield typeorm_1.getRepository(Group_1.Group)
        .createQueryBuilder('group')
        .leftJoinAndSelect('group.member', 'member')
        .leftJoinAndSelect('group.admin', 'admin')
        .where('group.id = :id', { id: Number(req.params.id) })
        .getOne();
    if (!existedGroup) {
        throw new badRequestError_1.BadRequestError('Group not Found');
    }
    const index = existedGroup.admin.findIndex(admin => admin.id === req.currentUser.id);
    if (index === -1) {
        throw new badRequestError_1.BadRequestError('GROUP NOT FOUND');
    }
    let userID;
    if (memberID) {
        userID = memberID;
    }
    if (adminID) {
        userID = adminID;
    }
    const user = yield typeorm_1.getRepository(Users_1.Users)
        .createQueryBuilder()
        .where('id =:id', { id: userID })
        .getOne();
    if (!user) {
        throw new badRequestError_1.BadRequestError('no User Found');
    }
    if (memberID)
        existedGroup.member.push(user);
    if (adminID)
        existedGroup.admin.push(adminID);
    yield typeorm_1.getRepository(Group_1.Group).save(existedGroup);
    res.send({ existedGroup });
}));
exports.deleteFromGroup = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    const { memberID, adminID } = req.body;
    const existedGroup = yield typeorm_1.getRepository(Group_1.Group)
        .createQueryBuilder('group')
        .leftJoinAndSelect('group.admin', 'admin')
        .leftJoinAndSelect('group.member', 'member')
        .where('group.id =:id', { id: Number(req.params.id) })
        .getOne();
    if (!existedGroup) {
        throw new badRequestError_1.BadRequestError('Group not Found');
    }
    const index = existedGroup.admin.findIndex(admin => admin.id == req.currentUser.id);
    if (index === -1) {
        throw new badRequestError_1.BadRequestError('GROUP NOT FOUND');
    }
    if (memberID) {
        const member = existedGroup.member.filter(member => member.id === memberID);
        existedGroup.member = member;
    }
    if (adminID) {
        const admin = existedGroup.admin.filter(admin => admin.id === adminID);
        existedGroup.admin = admin;
    }
    typeorm_1.getRepository(Group_1.Group).save(existedGroup);
    res.send({});
}));
exports.allowPost = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    const { postID } = req.body;
    const existedGroup = yield typeorm_1.getRepository(Group_1.Group)
        .createQueryBuilder('group')
        .leftJoinAndSelect('group.admin', 'admin')
        .leftJoinAndSelect('group.member', 'member')
        .where('group.id =:id', { id: Number(req.params.id) })
        .getOne();
    if (!existedGroup) {
        throw new badRequestError_1.BadRequestError('Group not Found');
    }
    const index = existedGroup.admin.findIndex(admin => admin.id == req.currentUser.id);
    if (index === -1) {
        throw new badRequestError_1.BadRequestError('GROUP NOT FOUND');
    }
    yield typeorm_1.getConnection()
        .createQueryBuilder()
        .update(Post_1.Post)
        .set({ allow: true })
        .where('id = :id', { id: postID })
        .execute();
    res.send({});
}));
exports.denyPost = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    const { postID } = req.body;
    const existedGroup = yield typeorm_1.getRepository(Group_1.Group)
        .createQueryBuilder('group')
        .leftJoinAndSelect('group.admin', 'admin')
        .leftJoinAndSelect('group.member', 'member')
        .where('group.id =:id', { id: Number(req.params.id) })
        .getOne();
    if (!existedGroup) {
        throw new badRequestError_1.BadRequestError('Group not Found');
    }
    const index = existedGroup.admin.findIndex(admin => admin.id == req.currentUser.id);
    if (index === -1) {
        throw new badRequestError_1.BadRequestError('GROUP NOT FOUND');
    }
    yield typeorm_1.getConnection()
        .createQueryBuilder()
        .delete()
        .from(Post_1.Post)
        .where('id = :id', { id: postID })
        .execute();
    res.send({});
}));
exports.getGroupPost = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    const { skip } = req.body;
    const posts = yield typeorm_1.getRepository(Group_1.Group)
        .createQueryBuilder('group')
        .leftJoinAndSelect('group.room', 'room')
        .where('room.groupRoom =:id', { id: Number(req.params.id) })
        .take(10)
        .skip(10 * skip)
        .getOne();
    if (!posts) {
        throw new badRequestError_1.BadRequestError('no post refresh');
    }
    res.send({ posts: posts.room });
}));
//# sourceMappingURL=groupController.js.map