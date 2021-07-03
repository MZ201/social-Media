"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomError_1 = __importDefault(require("./CustomError"));
class BadRequestError extends CustomError_1.default {
    constructor(message, field) {
        super(message);
        this.message = message;
        this.field = field;
        this.statusCode = 400;
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
    generateError() {
        return [{ message: this.message, field: this.field }];
    }
}
exports.BadRequestError = BadRequestError;
//# sourceMappingURL=badRequestError.js.map