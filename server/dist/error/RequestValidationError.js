"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomError_1 = __importDefault(require("./CustomError"));
class RequestValidationError extends CustomError_1.default {
    constructor(errors) {
        super("invalid Request paramre");
        this.errors = errors;
        this.statusCode = 400;
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
    generateError() {
        return this.errors.map(err => ({ message: err.msg, field: err.param }));
    }
}
exports.RequestValidationError = RequestValidationError;
//# sourceMappingURL=RequestValidationError.js.map