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
const Page_1 = require("../entity/Page");
const typeorm_1 = require("typeorm");
const badRequestError_1 = require("../error/badRequestError");
const Post_1 = require("../entity/Post");
const Comment_1 = require("../entity/Comment");
exports.createPage = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    const { name } = req.body;
    yield typeorm_1.getConnection()
        .createQueryBuilder()
        .insert()
        .into(Page_1.Page)
        .values({
        name,
        creator: req.currentUser
    })
        .execute();
    res.send({});
}));
exports.deletePage = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    const deletedPage = yield typeorm_1.getRepository(Page_1.Page).findOne({
        where: [{
                id: Number(req.params.id)
            }]
    });
    if (!deletedPage) {
        throw new badRequestError_1.BadRequestError('no Page  Exsist');
    }
    let posts;
    posts = yield typeorm_1.getRepository(Post_1.Post)
        .createQueryBuilder('post')
        .innerJoinAndSelect('post.pageRoom', 'page')
        .where('post.pageRoom = :id', { id: Number(req.params.id) })
        .select('post')
        .addSelect('page.name')
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
            .innerJoinAndSelect('comment.post', 'post')
            .where(`comment.post IN(${search})`)
            .getMany();
        yield typeorm_1.getRepository(Comment_1.Comment).remove(comment);
    }
    yield typeorm_1.getRepository(Post_1.Post).remove(posts);
    yield typeorm_1.getRepository(Page_1.Page).remove(deletedPage);
    res.send({});
}));
exports.updatePage = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    const { name, image, backgroundImage } = req.body;
    let change = {};
    if (name) {
        change = Object.assign({}, change, { name });
    }
    if (image) {
        change = Object.assign({}, change, { image });
    }
    if (backgroundImage) {
        change = Object.assign({}, change, { backgroundImage });
    }
    const update = yield typeorm_1.getConnection()
        .createQueryBuilder()
        .update(Page_1.Page)
        .where('id = :id', { id: req.params.id })
        .set(change)
        .execute();
    if (update.affected === 0) {
        throw new badRequestError_1.BadRequestError('Page not Found');
    }
    res.send({});
}));
exports.likePage = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    const update = yield typeorm_1.getRepository(Page_1.Page)
        .createQueryBuilder('page')
        .leftJoinAndSelect('page.followers', 'followers')
        .where('page.id = :id', { id: Number(req.params.id) })
        .getOne();
    if (!update) {
        throw new badRequestError_1.BadRequestError('page not Found');
    }
    update.followers.push(req.currentUser);
    yield typeorm_1.getRepository(Page_1.Page).save(update);
    res.send({});
}));
exports.dislikePage = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    const update = yield typeorm_1.getRepository(Page_1.Page)
        .createQueryBuilder('page')
        .leftJoinAndSelect('page.followers', 'followers')
        .where('page.id = :id', { id: Number(req.params.id) })
        .getOne();
    if (!update) {
        throw new badRequestError_1.BadRequestError('page not Found');
    }
    update.followers = update.followers.filter(User => User.id !== req.currentUser.id);
    yield typeorm_1.getRepository(Page_1.Page).save(update);
    res.send({});
}));
exports.getPage = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    const page = yield typeorm_1.getRepository(Page_1.Page)
        .createQueryBuilder('page')
        .leftJoinAndSelect('page.followers', 'followers')
        .where("page.id =:id", { id: req.params.id })
        .getOne();
    res.send({ page });
}));
exports.getPagePost = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    const { skip } = req.body;
    const posts = yield typeorm_1.getRepository(Page_1.Page)
        .createQueryBuilder('page')
        .leftJoinAndSelect('page.room', 'room')
        .where('room.pageRoom =:id', { id: Number(req.params.id) })
        .take(10)
        .skip(10 * skip)
        .getOne();
    console.log(posts);
    if (!posts) {
        throw new badRequestError_1.BadRequestError('no post refresh');
    }
    res.send({ posts: posts });
}));
//# sourceMappingURL=pageController.js.map