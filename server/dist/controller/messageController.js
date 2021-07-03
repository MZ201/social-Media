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
const Users_1 = require("../entity/Users");
const typeorm_1 = require("typeorm");
const Message_1 = require("../entity/Message");
const badRequestError_1 = require("../error/badRequestError");
exports.createMessage = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    const { ref, recepient, body } = req.body;
    const recepientUser = yield typeorm_1.getRepository(Users_1.Users).findOne({
        id: recepient
    });
    if (!recepientUser) {
        throw new badRequestError_1.BadRequestError("check the recepient");
    }
    const refMessage = yield typeorm_1.getRepository(Message_1.Message).findOne({
        id: ref
    });
    yield typeorm_1.getConnection()
        .createQueryBuilder()
        .insert()
        .into(Message_1.Message)
        .values({
        sender: req.currentUser,
        recepient: recepientUser,
        body,
        ref: refMessage
    })
        .execute();
    res.json({});
}));
exports.deleteMessage = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    const deletedByRecepient = yield typeorm_1.getConnection()
        .createQueryBuilder()
        .update(Message_1.Message)
        .set({
        deletedByRecepient: true
    })
        .where("id = :id", { id: Number(req.params.id) })
        .andWhere("recepientId =:user ", { user: Number(req.currentUser.id) })
        .execute();
    if (deletedByRecepient.affected === 0) {
        yield typeorm_1.getConnection()
            .createQueryBuilder()
            .update(Message_1.Message)
            .set({
            deletedBySender: true
        })
            .where("id = :id", { id: Number(req.params.id) })
            .andWhere("senderId =:user ", { user: Number(req.currentUser.id) })
            .execute();
    }
    yield typeorm_1.getConnection()
        .createQueryBuilder()
        .delete()
        .from(Message_1.Message)
        .where("id = :id", { id: Number(req.params.id) })
        .andWhere("deletedBySender = true")
        .andWhere("deletedByRecepient = true")
        .execute();
    res.json({});
}));
exports.deleteConversation = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    const { userID } = req.body;
    yield typeorm_1.getConnection()
        .createQueryBuilder()
        .update(Message_1.Message)
        .set({
        deletedBySender: true
    })
        .where("senderId =:id", { id: req.currentUser.id })
        .andWhere("recepientId =:ID", { ID: userID })
        .execute();
    yield typeorm_1.getConnection()
        .createQueryBuilder()
        .update(Message_1.Message)
        .set({
        deletedByRecepient: true
    })
        .where("senderId =:id", { id: userID })
        .andWhere("recepientId =:ID", { ID: req.currentUser.id })
        .execute();
    yield typeorm_1.getConnection()
        .createQueryBuilder()
        .delete()
        .from(Message_1.Message)
        .where("senderId =:id", { id: req.currentUser.id })
        .andWhere("deletedBySender = true")
        .andWhere("deletedByRecepient = true")
        .orWhere("recepientId =:id")
        .andWhere("deletedBySender = true")
        .andWhere("deletedByRecepient = true")
        .execute();
    res.json({});
}));
exports.getConversation = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
    const { userID, skip } = req.body;
    const conversation = yield typeorm_1.getRepository(Message_1.Message)
        .createQueryBuilder('message')
        .leftJoinAndSelect('message.sender', 'sender')
        .leftJoinAndSelect('message.recepient', 'recepient')
        .where('sender.id =:senderID', { senderID: req.currentUser.id })
        .where('recepient.id =:recepientID', { recepientID: userID })
        .where('deletedBysender = false')
        .orWhere('deletedByrecepient = fasle')
        .where('sender.id =:senderID', { senderID: userID })
        .where('recepient.id =:recepientID', { recepientID: req.currentUser.id })
        .take(10)
        .skip(10 * skip)
        .getMany();
    res.send({ conversation: conversation });
}));
//# sourceMappingURL=messageController.js.map