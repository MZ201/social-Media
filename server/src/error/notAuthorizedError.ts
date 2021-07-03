import BaseError from "./CustomError";


export class notAuthorizedError extends BaseError {
    statusCode = 401
    constructor() {
        super('not Authorized');

        Object.setPrototypeOf(this, notAuthorizedError.prototype);
    }
    generateError() {
        return [{ message:"not Authorized" }]
    }
}