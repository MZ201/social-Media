import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { RequestValidationError } from "../error/RequestValidationError";


export const validate = (req: Request,  _: Response , next: NextFunction) => {
    const errors = (validationResult(req)) 
    if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array()) 
    }
    next()
}