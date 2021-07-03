import { ValidationError } from "express-validator";
import BaseError from "./CustomError";

export class RequestValidationError extends BaseError {
    statusCode = 400

    constructor(public errors: ValidationError[]) {
        super("invalid Request paramre")
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
    generateError(){
        return this.errors.map(err =>({message: err.msg, field: err.param}))
    }
}