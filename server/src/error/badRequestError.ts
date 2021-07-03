import BaseError from "./CustomError";


export class BadRequestError extends BaseError {
    statusCode = 400
    constructor(public message : string ,public field?: string) {
        super(message);

        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
    generateError(){
    return [{message : this.message , field : this.field}]
    }  
}