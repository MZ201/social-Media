
export default abstract class BaseError extends Error {
    abstract statusCode: number;

    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, BaseError.prototype);
    }

    abstract generateError() :{message : string , field ?: string}[]
}