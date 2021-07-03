import BaseError from "./CustomError";

export class NotFoundError extends BaseError {
    statusCode = 404
    constructor() {
        super('Route not found');

        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    generateError(){
        return [{message : 'Not Found'}]
    }
}