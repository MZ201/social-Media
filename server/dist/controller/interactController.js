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
const Interact_1 = require("../entity/Interact");
const Users_1 = require("../entity/Users");
const badRequestError_1 = require("../error/badRequestError");
const typeorm_1 = require("typeorm");
const Interact_2 = require("../entity/Interact");
const Group_1 = require("../entity/Group");
exports.addInteraction = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    const { Action, id } = req.body;
    let users, group;
    switch (Number(Action)) {
        case Interact_2.action.friendship:
            const user = yield typeorm_1.getRepository(Users_1.Users)
                .createQueryBuilder('user')
                .where('id = :id', { id })
                .getOne();
            if (!user) {
                throw new badRequestError_1.BadRequestError('no User Found');
            }
            users = [user];
            break;
        case Interact_2.action.addToGroup:
            group = yield typeorm_1.getRepository(Group_1.Group)
                .createQueryBuilder('group')
                .where('id = :id', { id })
                .getOne();
            if (!group) {
                throw new badRequestError_1.BadRequestError('Group not Found');
            }
            let search = '';
            let size = group.admin.length;
            group.admin.forEach((admin, index) => {
                search += admin;
                if (index != size - 1) {
                    search += ',';
                }
            });
            users = yield typeorm_1.getRepository(Users_1.Users)
                .createQueryBuilder('users')
                .where(`id IN (${search})`)
                .getMany();
            break;
        default:
            throw new badRequestError_1.BadRequestError('something  wrong in your action');
    }
    const interact = new Interact_1.Interact();
    interact.recepient = users;
    interact.action = Action;
    interact.sender = req.currentUser;
    yield typeorm_1.getRepository(Interact_1.Interact).save(interact);
    res.send({});
}));
exports.removeInteraction = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    const result = yield typeorm_1.getRepository(Interact_1.Interact)
        .createQueryBuilder('interact')
        .leftJoinAndSelect('interact.sender', 'sender')
        .where('interact.id = :id', { id: Number(req.params.id) })
        .andWhere('sender.id =:userID', { userID: req.currentUser.id })
        .getOne();
    if (!result) {
        throw new badRequestError_1.BadRequestError('not Found');
    }
    yield typeorm_1.getRepository(Interact_1.Interact).remove(result);
    res.send({});
}));
exports.getInteraction = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    const result = yield typeorm_1.getRepository(Interact_1.Interact)
        .createQueryBuilder('interact')
        .leftJoinAndSelect('interact.sender', 'sender')
        .where('interact.id = :id', { id: Number(req.params.id) })
        .select('interact')
        .addSelect('sender.name')
        .getOne();
    res.send({ result });
}));
exports.confirmInteraction = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    const update = yield typeorm_1.getRepository(Interact_1.Interact)
        .createQueryBuilder('interact')
        .leftJoinAndSelect('interact.recepient', 'recepient')
        .where('interact.id = :id', { id: Number(req.params.id) })
        .getOne();
    if (!update) {
        throw new badRequestError_1.BadRequestError('no Interaction found');
    }
    const index = update.recepient.findIndex(user => user.id === req.currentUser.id);
    if (index === -1) {
        throw new badRequestError_1.BadRequestError('this is not a true process');
    }
    if (req.query.ignore)
        update.ignore = true;
    if (req.query.seen)
        update.seen = true;
    yield typeorm_1.getRepository(Interact_1.Interact).save(update);
    res.send({});
}));
exports.asSenderInteraction = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    const senderInteract = yield typeorm_1.getRepository(Interact_1.Interact)
        .createQueryBuilder('interact')
        .leftJoinAndSelect('interact.sender', 'sender')
        .where('sender.id =:id', { id: req.currentUser.id })
        .select('interact')
        .addSelect('sender')
        .getMany();
    if (!senderInteract) {
        throw new badRequestError_1.BadRequestError('not Found any Interaction for you ');
    }
    res.send({ interact: senderInteract });
}));
exports.asRecepientInteraction = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    const result = yield typeorm_1.getRepository(Interact_1.Interact)
        .createQueryBuilder('interact')
        .leftJoinAndSelect('interact.recepient', 'recepient')
        .select('interact')
        .addSelect('recepient')
        .where('recepient.id =:id', { id: req.currentUser.id })
        .andWhere('interact.ignore = false')
        .getMany();
    res.send({ interact: result });
}));
//# sourceMappingURL=interactController.js.map