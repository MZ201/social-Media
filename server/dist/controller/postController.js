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
const Post_1 = require("../entity/Post");
const typeorm_1 = require("typeorm");
const badRequestError_1 = require("../error/badRequestError");
const Page_1 = require("../entity/Page");
const Group_1 = require("../entity/Group");
const Comment_1 = require("../entity/Comment");
const Reaction_1 = require("../entity/Reaction");
exports.addPost = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    let { body, groupRoom, pageRoom } = req.body;
    let page, group;
    if (pageRoom) {
        page = yield typeorm_1.getRepository(Page_1.Page).findOne({
            id: Number(pageRoom)
        });
    }
    if (groupRoom) {
        group = yield typeorm_1.getRepository(Group_1.Group)
            .createQueryBuilder('group')
            .leftJoinAndSelect('group.admin', 'admin')
            .leftJoinAndSelect('group.member', 'member')
            .where('group.id =:id', { id: groupRoom })
            .getOne();
    }
    body.isVideo = false;
    if (body.video !== "")
        body.isVideo = true;
    let allow = true;
    pageRoom = page ? page.id : null;
    groupRoom = group ? group.id : null;
    if (group && group.admin.findIndex(admin => admin.id === req.currentUser.id) === -1) {
        allow = false;
    }
    const createdPost = yield typeorm_1.getRepository(Post_1.Post).create({
        body: body, creator: req.currentUser, pageRoom, groupRoom, allow
    });
    yield typeorm_1.getRepository(Post_1.Post).save(createdPost);
    res.json({});
}));
exports.deletePost = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    const deletedPost = yield typeorm_1.getRepository(Post_1.Post).findOne({
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
    if (!deletedPost || (req.currentUser.id !== deletedPost.creator.id && index === -1)) {
        throw new badRequestError_1.BadRequestError('Post not Found');
    }
    const deletedComment = yield typeorm_1.getRepository(Comment_1.Comment).find({
        relations: ['post'],
        where: [{
                post: Number(req.params.id)
            }]
    });
    yield typeorm_1.getRepository(Comment_1.Comment).remove(deletedComment);
    yield typeorm_1.getRepository(Post_1.Post).delete(deletedPost);
    res.json({});
}));
exports.getPost = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
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
    let posts;
    try {
        posts = yield typeorm_1.getRepository(Post_1.Post)
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.creator', 'creator')
            .leftJoinAndSelect('post.pageRoom', 'page')
            .leftJoinAndSelect('post.groupRoom', 'group')
            .where('creator.id IN (:...friends)', { friends: friends })
            .orWhere('page.id IN (:...page)', { page: page })
            .orWhere('group.id IN (:...group)', { group: group })
            .take(10)
            .skip(10 * skip)
            .orderBy('post.createdAt', 'DESC')
            .getMany();
    }
    catch (err) {
        throw new badRequestError_1.BadRequestError(err.message);
    }
    res.send({ posts });
}));
exports.getVideoPost = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
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
    let posts;
    try {
        posts = yield typeorm_1.getRepository(Post_1.Post)
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.creator', 'creator')
            .leftJoinAndSelect('post.pageRoom', 'page')
            .leftJoinAndSelect('post.groupRoom', 'group')
            .where(`post.body ::JSONB @>  :body`, {
            body: {
                isVideo: true
            }
        })
            .orWhere('creator.id IN (:...friends)', { friends: friends })
            .orWhere('page.id IN (:...page)', { page: page })
            .orWhere('group.id IN (:...group)', { group: group })
            .take(10)
            .skip(10 * skip)
            .orderBy('post.createdAt', 'DESC')
            .getMany();
    }
    catch (err) {
        throw new badRequestError_1.BadRequestError('something wrong in query');
    }
    res.send({ posts });
}));
exports.getGroupsPost = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    const skip = Number(req.query.skip) || 0;
    let group = req.currentUser.groupMember.map(member => member.id);
    if (group.length === 0) {
        group = [0];
    }
    const posts = yield typeorm_1.getRepository(Post_1.Post)
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.groupRoom', 'group')
        .where('group.id IN (:...group)', { group })
        .take(10)
        .skip(10 * skip)
        .orderBy('post.createdAt', 'DESC')
        .getMany();
    res.send({ posts });
}));
exports.numberOfInteractionOfPost = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    const Comments = yield typeorm_1.getRepository(Comment_1.Comment)
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.post', 'post')
        .where('post.id =:postID', { postID: req.params.id })
        .getCount();
    const reactions = yield typeorm_1.getRepository(Reaction_1.Reaction)
        .createQueryBuilder('reaction')
        .leftJoinAndSelect('reaction.post', 'post')
        .where('post.id =:postID', { postID: req.params.id })
        .getCount();
    const share = yield typeorm_1.getRepository(Post_1.Post)
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.share', 'share')
        .where('post.id = :postID', { postID: req.params.id })
        .getOne();
    if (!share) {
        throw new badRequestError_1.BadRequestError('post not found ');
    }
    res.send({ comments: Comments, reactions, share: share.share.length });
}));
exports.sharePost = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    const { postID } = req.body;
    try {
        yield typeorm_1.getConnection()
            .createQueryBuilder()
            .relation(Post_1.Post, 'share')
            .of(postID)
            .add(req.currentUser);
    }
    catch (err) {
        throw new badRequestError_1.BadRequestError(err.message);
    }
    res.send({});
}));
exports.cancelShare = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    const { postID } = req.body;
    try {
        yield typeorm_1.getConnection()
            .createQueryBuilder()
            .relation(Post_1.Post, 'share')
            .of(postID)
            .remove(req.currentUser.id);
    }
    catch (err) {
        throw new badRequestError_1.BadRequestError(err.message);
    }
    res.send({});
}));
//# sourceMappingURL=postController.js.map