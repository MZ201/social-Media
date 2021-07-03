import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { Interact } from '../entity/Interact'
import { Users } from '../entity/Users'
import { BadRequestError } from '../error/badRequestError'
import { getRepository } from 'typeorm'
import { action } from '../entity/Interact'
import { Group } from '../entity/Group'



// POST /api/interact/: 
// Private
// Create A Interacaction
export const addInteraction = asyncHandler(async (req: Request, res: Response) => {
    const { Action, id } = req.body

    let users: Users[], group

    switch (Number(Action)) {
        case action.friendship:
            const user = await getRepository(Users)
                .createQueryBuilder('user')
                .where('id = :id', { id })
                .getOne()

            if (!user) {
                throw new BadRequestError('no User Found')
            }
            users = [user]
            break;
        case action.addToGroup:
            group = await getRepository(Group)
                .createQueryBuilder('group')
                .where('id = :id', { id })
                .getOne()

            if (!group) {
                throw new BadRequestError('Group not Found')
            }

            let search = ''
            let size = group.admin.length
            group.admin.forEach((admin, index) => {
                search += admin
                if (index != size - 1) {
                    search += ','
                }
            })

            users = await getRepository(Users)
                .createQueryBuilder('users')
                .where(`id IN (${search})`)
                .getMany()

            break;
        default:
            throw new BadRequestError('something  wrong in your action')

    }
    const interact = new Interact()
    interact.recepient = users
    interact.action = Action
    interact.sender = req.currentUser!

    await getRepository(Interact).save(interact)

    res.send({})
})


// delete /api/interact/:id
// Private
// delete A Interaction
export const removeInteraction = asyncHandler(async (req: Request, res: Response) => {

    const result = await getRepository(Interact)
        .createQueryBuilder('interact')
        .leftJoinAndSelect('interact.sender', 'sender')
        .where('interact.id = :id', { id: Number(req.params.id) })
        .andWhere('sender.id =:userID', { userID: req.currentUser!.id })
        .getOne()

    if (!result) {
        throw new BadRequestError('not Found')
    }

    await getRepository(Interact).remove(result)

    res.send({})
})

// Get /api/interact/:id
// Private
// get A Interaction
export const getInteraction = asyncHandler(async (req: Request, res: Response) => {
    const result = await getRepository(Interact)
        .createQueryBuilder('interact')
        .leftJoinAndSelect('interact.sender', 'sender')
        .where('interact.id = :id', { id: Number(req.params.id) })
        .select('interact')
        .addSelect('sender.name')
        .getOne()
    res.send({ result })
})


//put /api/interact/:id
// Private
// ignore certain interaction 
export const confirmInteraction = asyncHandler(async (req: Request, res: Response) => {

    const update = await getRepository(Interact)
        .createQueryBuilder('interact')
        .leftJoinAndSelect('interact.recepient', 'recepient')
        .where('interact.id = :id', { id: Number(req.params.id) })
        .getOne()

    if (!update) {
        throw new BadRequestError('no Interaction found')
    }

    const index = update.recepient.findIndex(user => user.id === req.currentUser!.id)

    if (index === -1) {
        throw new BadRequestError('this is not a true process')
    }

    if (req.query.ignore)
        update.ignore = true

    if (req.query.seen)
        update.seen = true

    await getRepository(Interact).save(update)
    res.send({})
})



// get my sender interaction 

export const asSenderInteraction = asyncHandler(async (req: Request, res: Response) => {
    const senderInteract = await getRepository(Interact)
        .createQueryBuilder('interact')
        .leftJoinAndSelect('interact.sender', 'sender')
        .where('sender.id =:id', { id: req.currentUser!.id })
        .select('interact')
        .addSelect('sender')
        .getMany()

    if (!senderInteract) {
        throw new BadRequestError('not Found any Interaction for you ')
    }

    res.send({ interact: senderInteract })
})
// get all the interaction send to me 
export const asRecepientInteraction = asyncHandler(async (req: Request, res: Response) => {
    const result = await getRepository(Interact)
                        .createQueryBuilder('interact')
                        .leftJoinAndSelect('interact.recepient' , 'recepient')
                        .select('interact')
                        .addSelect('recepient')
                        .where('recepient.id =:id' , {id : req.currentUser!.id})
                        .andWhere('interact.ignore = false')
                        .getMany()

    res.send({interact : result})
})