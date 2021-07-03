"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomError_1 = __importDefault(require("./CustomError"));
class NotFoundError extends CustomError_1.default {
    constructor() {
        super('Route not found');
        this.statusCode = 404;
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
    generateError() {
        return [{ message: 'Not Found' }];
    }
}
exports.NotFoundError = NotFoundError;
//# sourceMappingURL=notFound.js.map