"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const RequestValidationError_1 = require("../error/RequestValidationError");
exports.validate = (req, _, next) => {
    const errors = (express_validator_1.validationResult(req));
    if (!errors.isEmpty()) {
        throw new RequestValidationError_1.RequestValidationError(errors.array());
    }
    next();
};
//# sourceMappingURL=validateLogin.js.map