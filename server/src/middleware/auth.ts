import { NextFunction, Request, Response } from "express";
import { Users } from "../entity/Users";
import { getRepository} from "typeorm";
import jwt from "jsonwebtoken";
import { notAuthorizedError } from "../error/notAuthorizedError";
import asyncHandler from "express-async-handler"
import { BadRequestError } from "../error/badRequestError";

export interface UserPayload {
    id: string;
}


declare global {
    namespace Express {
        interface Request {
            currentUser?: Users
        }
    }
}


export const protect = asyncHandler(async (req: Request, _: Response, next: NextFunction) => {

    if (!req.session || !req.session.jwt) {
        throw new notAuthorizedError()
    }

    const decoded = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload

    try {
        req.currentUser = await getRepository(Users)
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.friends', 'friends')
            .leftJoinAndSelect('user.groupMember', 'member')
            .leftJoinAndSelect('user.page', 'page')
            .where('user.id = :id', { id: decoded.id })
            .getOne()

    } catch (err) {
        throw new BadRequestError('something wrong in the seesionID')
    }

    next()
    return
})

