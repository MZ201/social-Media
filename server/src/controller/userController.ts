import { Request, Response } from "express";
import { Users } from "../entity/Users";
import { getManager, getRepository } from "typeorm";
import { Password } from "../utils/passwordManager";
import jwt from "jsonwebtoken"
import asyncHandler from 'express-async-handler'
import { BadRequestError } from "../error/badRequestError";
import { Post } from "../entity/Post";
import { action, Interact } from "../entity/Interact";


// Public
// POST "api/user/login"
// login certain user
export const userLogin = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body

    const exsistedUser = await getRepository(Users)
        .createQueryBuilder('user')
        .where('email =:email', { email: email })
        .select('user')
        .addSelect('user.password')
        .getOne()

    if (!exsistedUser || await Password.compare(exsistedUser.password, password) === false) {
        throw new BadRequestError("entry is wrong")
    }

    const userJwt = jwt.sign({
        id: exsistedUser.id
    }, process.env.JWT_KEY!)
    req.session = {
        jwt: userJwt
    }
    return res.send(exsistedUser)
})

// Public 
// POST  '/api/user/register
// Register a user
export const userRegister = asyncHandler(async (req: Request, res: Response) => {
    let { name, email, phoneNumber, password } = req.body

    const exsistedUser = await getRepository(Users).findOne({ email })

    if (exsistedUser) {
        throw new BadRequestError('email in use', "email")
    }
    // Hash the Password 
    password = await Password.toHash(password)

    // Create a User
    const createdUser = await getRepository(Users).create({ name, email, phoneNumber, password })


    await getRepository(Users).save(createdUser)

    return res.send({ createdUser })

})

export const userLogout = asyncHandler((req: Request, res: Response) => {
    req.session = null

    res.send({})
})


export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const deletedUser = await getRepository(Users).findOne({ id })
    if (deletedUser) {
        await getRepository(Users).remove(deletedUser)
    } else {
        res.status(400)
        throw new BadRequestError("User not Found")
    }
    res.send({})
})



export const getMe = asyncHandler(async (req: Request, res: Response) => {
    res.send({ user: req.currentUser! })
})

export const addFriends = asyncHandler(async (req: Request, res: Response) => {
    const { userID } = req.body

    const confirm = await getRepository(Interact)
        .createQueryBuilder('interact')
        .leftJoinAndSelect('interact.sender', 'sender')
        .leftJoinAndSelect('interact.recepient', 'recepient')
        .where('sender.id =:senderID', { senderID: userID })
        .andWhere('recepient.id =:recepientID', { recepientID: req.currentUser!.id })
        .andWhere('interact.action = :action', { action: action.friendship })
        .getOne()


    if (!confirm) {
        throw new BadRequestError('no Demand for drandship')
    }

    const you = await getRepository(Users)
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.friends', 'friends')
        .where('user.id =:id', { id: userID })
        .getOne()

    if (!you) {
        throw new BadRequestError('no user Found')
    }

    you.friends.push(req.currentUser!)

    req.currentUser!.friends.push(you)

    await getManager().transaction(async transactionalEntityManager => {
        await transactionalEntityManager.save(you);
        await transactionalEntityManager.save(req.currentUser!);
        await transactionalEntityManager.remove(confirm)
    });

    res.send({})
})





export const getMyPost = asyncHandler(async (req: Request, res: Response) => {
    const {skip} = req.body
    const myPost = await getRepository(Post)
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.creator' , 'creator')
        .leftJoin('post.share' ,'share')
        .where('creator.id =:id' , {id : req.currentUser!.id})
        .orWhere('share.id = :userID' , {userID : req.currentUser!.id})
        .take(10)
        .skip(10 * skip)
        .getMany()

    
    res.send({myPost})
})




