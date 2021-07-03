"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomError_1 = __importDefault(require("./CustomError"));
class notAuthorizedError extends CustomError_1.default {
    constructor() {
        super('not Authorized');
        this.statusCode = 401;
        Object.setPrototypeOf(this, notAuthorizedError.prototype);
    }
    generateError() {
        return [{ message: "not Authorized" }];
    }
}
exports.notAuthorizedError = notAuthorizedError;
//# sourceMappingURL=notAuthorizedError.js.map