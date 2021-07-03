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
const Reaction_1 = require("../entity/Reaction");
const badRequestError_1 = require("../error/badRequestError");
const typeorm_1 = require("typeorm");
const Comment_1 = require("../entity/Comment");
exports.addReaction = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    const { reaction } = req.body;
    let post, comment;
    if ((!req.query.post && !req.query.comment) ||
        (req.query.comment && req.query.post)) {
        throw new badRequestError_1.BadRequestError('check your query');
    }
    if (req.query.post) {
        post = yield typeorm_1.getRepository(Post_1.Post).findOne({ id: Number(req.query.post) });
        if (!post) {
            throw new badRequestError_1.BadRequestError('Post not Found');
        }
        try {
            yield typeorm_1.getConnection()
                .createQueryBuilder()
                .insert()
                .into(Reaction_1.Reaction)
                .values({
                created: req.currentUser, post, reaction: reaction
            })
                .execute();
        }
        catch (err) {
            throw new badRequestError_1.BadRequestError(err.message);
        }
    }
    if (req.query.comment) {
        comment = yield typeorm_1.getRepository(Comment_1.Comment).findOne({ id: Number(req.query.comment) });
        if (!comment) {
            throw new badRequestError_1.BadRequestError('Comemnt not Found');
        }
        try {
            yield typeorm_1.getConnection()
                .createQueryBuilder()
                .insert()
                .into(Reaction_1.ReactionToComment)
                .values({
                created: req.currentUser, comment, reaction: reaction
            })
                .execute();
        }
        catch (err) {
            throw new badRequestError_1.BadRequestError(err.message);
        }
    }
    res.json({});
}));
exports.updateReaction = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    const { reaction } = req.body;
    const Model = req.query.post ? Reaction_1.Reaction : Reaction_1.ReactionToComment;
    yield typeorm_1.getConnection()
        .createQueryBuilder()
        .update(Model)
        .set({
        reaction
    })
        .where('id = :id', { id: Number(req.params.id) })
        .execute();
    res.send({});
}));
exports.getReaction = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    let reaction;
    const skip = Number(req.query.skip) || 0;
    if ((!req.query.post && !req.query.comment) ||
        (req.query.comment && req.query.post)) {
        throw new badRequestError_1.BadRequestError('check your query');
    }
    if (req.query.post) {
        reaction = yield typeorm_1.getRepository(Reaction_1.Reaction)
            .createQueryBuilder('reaction')
            .leftJoinAndSelect('reaction.created', 'creator')
            .leftJoinAndSelect('reaction.post', 'post')
            .select(['post.id', 'reaction.reaction'])
            .where('creator.id = :userID', { userID: req.currentUser.id })
            .limit(10)
            .skip(skip * 10)
            .getMany();
    }
    if (req.query.comment) {
        reaction = yield typeorm_1.getRepository(Reaction_1.ReactionToComment)
            .createQueryBuilder('reaction')
            .leftJoinAndSelect('reaction.comment', 'comment')
            .select(['reaction.id', 'reaction.reaction'])
            .where('reaction.id = :userID', { userID: req.currentUser.id })
            .limit(4)
            .skip(4 * skip)
            .getMany();
    }
    res.json({ reaction });
}));
exports.deleteReaction = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    if ((!req.query.post && !req.query.comment) ||
        (req.query.comment && req.query.post)) {
        throw new badRequestError_1.BadRequestError('check your query');
    }
    const Model = req.query.post === 'true' ? Reaction_1.Reaction : Reaction_1.ReactionToComment;
    yield typeorm_1.getConnection()
        .createQueryBuilder()
        .delete()
        .from(Model)
        .where('id =:id', { id: Number(req.params.id) })
        .execute();
    res.send({});
}));
//# sourceMappingURL=reactionController.js.map