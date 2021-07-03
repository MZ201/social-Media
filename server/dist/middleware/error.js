"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomError_1 = __importDefault(require("../error/CustomError"));
exports.errorHandler = (err, _, res, __) => {
    if (err instanceof CustomError_1.default) {
        return res.status(err.statusCode).send({ errors: err.generateError() });
    }
    res.status(400).send({
        errors: [{ message: 'Something went wrong' }]
    });
};
//# sourceMappingURL=error.js.map