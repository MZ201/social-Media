import { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import { Users } from "../entity/Users"
import { getConnection, getRepository} from "typeorm"

import { Message } from "../entity/Message"
import { BadRequestError } from "../error/badRequestError"

// POST /api/message/ 
// Private
// Create A Message

export const createMessage = asyncHandler(async (req: Request, res: Response) => {
    const { ref, recepient, body } = req.body

    const recepientUser = await getRepository(Users).findOne({
        id: recepient
    })

    if (!recepientUser) {
        throw new BadRequestError("check the recepient")
    }
    const refMessage = await getRepository(Message).findOne({
        id: ref
    })

    await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Message)
        .values({
            sender: req.currentUser,
            recepient: recepientUser,
            body,
            ref: refMessage
        })
        .execute()


    res.json({})
})

// delete /api/message/:id 
// Private
// Create A Message

export const deleteMessage = asyncHandler(async (req: Request, res: Response) => {
    //

    const deletedByRecepient = await getConnection()
        .createQueryBuilder()
        .update(Message)
        .set({
            deletedByRecepient: true
        })
        .where("id = :id", { id: Number(req.params.id) })
        .andWhere("recepientId =:user ", { user: Number(req.currentUser!.id) })
        .execute()

    if (deletedByRecepient.affected === 0) {
        await getConnection()
            .createQueryBuilder()
            .update(Message)
            .set({
                deletedBySender: true
            })
            .where("id = :id", { id: Number(req.params.id) })
            .andWhere("senderId =:user ", { user: Number(req.currentUser!.id) })
            .execute()
    }


    await getConnection()
        .createQueryBuilder()
        .delete()
        .from(Message)
        .where("id = :id", { id: Number(req.params.id) })
        .andWhere("deletedBySender = true")
        .andWhere("deletedByRecepient = true")
        .execute()

    res.json({})
})

// delete a conversation between me and someone else all of it 
export const deleteConversation = asyncHandler(async (req: Request, res: Response) => {
    // 
    const { userID } = req.body

    await getConnection()
        .createQueryBuilder()
        .update(Message)
        .set({
            deletedBySender: true
        })
        .where("senderId =:id", { id: req.currentUser!.id })
        .andWhere("recepientId =:ID", { ID: userID })
        .execute()

    await getConnection()
        .createQueryBuilder()
        .update(Message)
        .set({
            deletedByRecepient: true
        })
        .where("senderId =:id", { id: userID })
        .andWhere("recepientId =:ID", { ID: req.currentUser!.id })
        .execute()

    await getConnection()
        .createQueryBuilder()
        .delete()
        .from(Message)
        .where("senderId =:id", { id: req.currentUser!.id })
        .andWhere("deletedBySender = true")
        .andWhere("deletedByRecepient = true")
        .orWhere("recepientId =:id")
        .andWhere("deletedBySender = true")
        .andWhere("deletedByRecepient = true")
        .execute()

    res.json({})
})


export const getConversation = asyncHandler(async (req: Request, res: Response) => {
    const { userID, skip } = req.body
    
    const conversation = await getRepository(Message)
        .createQueryBuilder('message')
        .leftJoinAndSelect('message.sender', 'sender')
        .leftJoinAndSelect('message.recepient', 'recepient')
        .where('sender.id =:senderID', { senderID: req.currentUser!.id })
        .where('recepient.id =:recepientID', { recepientID: userID })
        .where('deletedBysender = false')
        .orWhere('deletedByrecepient = fasle')
        .where('sender.id =:senderID', {senderID : userID})
        .where('recepient.id =:recepientID', { recepientID: req.currentUser!.id })
        .take(10)
        .skip(10 * skip)
        .getMany()

    res.send({conversation: conversation})

})


