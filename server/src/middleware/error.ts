import { NextFunction, Request, Response } from "express";
import BaseError from "../error/CustomError";



export const errorHandler = (err: Error, _: Request , res: Response, __: NextFunction) => {
    if (err instanceof BaseError) {
        return res.status(err.statusCode).send({ errors: err.generateError() });
    }
    res.status(400).send({
        errors: [{ message: 'Something went wrong' }]
    });
}