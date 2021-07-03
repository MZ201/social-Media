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
const badRequestError_1 = require("../error/badRequestError");
const typeorm_1 = require("typeorm");
const Comment_1 = require("../entity/Comment");
const Reaction_1 = require("../entity/Reaction");
exports.addComment = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    const { body, ref } = req.body;
    const post = yield typeorm_1.getRepository(Post_1.Post)
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.pageRoom', 'page')
        .where('post.id =:id', { id: Number(req.params.id) })
        .getOne();
    if (!post) {
        throw new badRequestError_1.BadRequestError('Post not Found');
    }
    let comment;
    if (ref) {
        comment = yield typeorm_1.getRepository(Comment_1.Comment)
            .createQueryBuilder('comment')
            .leftJoinAndSelect('comment.ref', 'ref')
            .where('comment.id =:commentID', { commentID: Number(ref) })
            .getOne();
    }
    const newComment = yield typeorm_1.getRepository(Comment_1.Comment).create({
        body,
        creator: req.currentUser,
        post,
        pageRoom: post.pageRoom,
    });
    yield typeorm_1.getRepository(Comment_1.Comment).save(newComment);
    if (comment) {
        try {
            yield typeorm_1.getConnection()
                .createQueryBuilder()
                .update(Comment_1.Comment)
                .set({
                ref
            })
                .where('id = :id', { id: newComment.id })
                .execute();
        }
        catch (err) {
            throw new badRequestError_1.BadRequestError(err.message);
        }
    }
    res.json({});
}));
exports.deleteComment = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    const deletedComment = yield typeorm_1.getRepository(Comment_1.Comment).findOne({ id: Number(req.params.id) });
    if (!deletedComment) {
        throw new badRequestError_1.BadRequestError('no Comment Found');
    }
    yield typeorm_1.getRepository(Comment_1.Comment).remove(deletedComment);
    res.json({});
}));
exports.getCommentOfPost = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    const skip = Number(req.query.skip) || 0;
    let Comments;
    try {
        Comments = yield typeorm_1.getRepository(Comment_1.Comment)
            .createQueryBuilder('comment')
            .leftJoin('comment.ref', 'ref')
            .leftJoinAndSelect('comment.post', 'post')
            .leftJoinAndSelect('ref.creator', 'refCreator')
            .leftJoinAndSelect('comment.creator', 'creator')
            .leftJoinAndSelect('comment.pageRoom', 'page')
            .where('post.id = :id ', { id: Number(req.params.id) })
            .andWhere('ref IS NULL')
            .take(3)
            .skip(3 * skip)
            .orderBy('comment.createdAt', "DESC")
            .getMany();
    }
    catch (err) {
        throw new badRequestError_1.BadRequestError(err.message);
    }
    if (!Comments) {
        throw new badRequestError_1.BadRequestError('not Found any Comments');
    }
    res.send({ comments: Comments });
}));
exports.getCommentOfComment = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    const Comments = yield typeorm_1.getRepository(Comment_1.Comment)
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.ref', 'ref')
        .leftJoinAndSelect('comment.post', 'post')
        .leftJoinAndSelect('comment.creator', 'creator')
        .leftJoinAndSelect('comment.pageRoom', 'page')
        .where('ref.id = :commentID', { commentID: Number(req.params.id) })
        .orderBy('comment.createdAt', 'DESC')
        .getMany();
    if (!Comments) {
        throw new badRequestError_1.BadRequestError('not Found any Comments');
    }
    res.send({ comments: Comments });
}));
exports.numberOfInteractionOfComment = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    let Comments;
    try {
        Comments = yield typeorm_1.getRepository(Comment_1.Comment)
            .createQueryBuilder('comment')
            .leftJoinAndSelect('comment.ref', 'ref')
            .select('ref.id')
            .addSelect('COUNT(ref.id)', 'count')
            .groupBy('ref.id')
            .where('ref.id =:commentID', { commentID: req.params.id })
            .getRawOne();
    }
    catch (err) {
        throw new badRequestError_1.BadRequestError(err.message);
    }
    let reactions;
    if (!req.query.comment) {
        try {
            reactions = yield typeorm_1.getRepository(Reaction_1.ReactionToComment)
                .createQueryBuilder('reaction')
                .leftJoinAndSelect('reaction.comment', 'comment')
                .select('reaction.reaction as reaction')
                .addSelect('COUNT(reaction.id)', 'count')
                .groupBy('reaction.reaction')
                .where('comment.id = :commentID', { commentID: req.params.id })
                .getRawMany();
        }
        catch (err) {
            throw new badRequestError_1.BadRequestError(err.message);
        }
    }
    res.send({ comments: Comments, reactions });
}));
exports.countCommentOfPost = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    let count;
    try {
        count = yield typeorm_1.getRepository(Comment_1.Comment)
            .createQueryBuilder('comment')
            .leftJoinAndSelect('comment.ref', 'ref')
            .leftJoinAndSelect('comment.post', 'post')
            .leftJoinAndSelect('ref.creator', 'refCreator')
            .where('post.id = :id ', { id: Number(req.params.id) })
            .andWhere('ref IS NULL')
            .getCount();
    }
    catch (err) {
        throw new badRequestError_1.BadRequestError(err.message);
    }
    res.send({ count: count, postID: Number(req.params.id) });
}));
//# sourceMappingURL=commentController.js.map