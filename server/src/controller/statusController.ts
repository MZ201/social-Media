import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { getConnection, getRepository } from 'typeorm'
import { BadRequestError } from '../error/badRequestError'
import { Page } from '../entity/Page'
import { Group } from '../entity/Group'
import { Status } from '../entity/Status'
import { Users } from '../entity/Users'


// POST /api/status
// PRIVATE 
//Created a status 
export const addStatus = asyncHandler(async (req: Request, res: Response) => {
    let { body, groupRoom, pageRoom } = req.body
    let page, group

    if (pageRoom) {
        page = await getRepository(Page).findOne({
            id: Number(pageRoom)
        })
    }

    if (groupRoom) {
        group = await getRepository(Group).findOne({
            id: Number(groupRoom)
        })
    }
    pageRoom = page ? page.id : null

    groupRoom = group ? group.id : null

    const createdStatus = await getRepository(Status).create({
        body: body, creator: req.currentUser, pageRoom, groupRoom
    })
    // use Socket to send the notification to all users 
    await getRepository(Status).save(createdStatus)


    req.app.get('io').to([...req.currentUser!.friends.map(fr => `${fr.id}`)])
    .emit('statusCreated', createdStatus)


    res.json({})
})

// DELETE /api/status/id of group &&:id id of Status
// Private
// DELETE A status BY WHO CREATED IT 
export const deleteStatus = asyncHandler(async (req: Request, res: Response) => {
    const deletedStatus = await getRepository(Status).findOne(
        {
            relations: ['creator'],
            where: [{ id: Number(req.params.id) }]
        }
    )
    let group;
    if (req.query.group) {
        group = await getRepository(Group)
            .createQueryBuilder('group')
            .leftJoinAndSelect('group.admin', 'admin')
            .leftJoinAndSelect('group.member', 'member')
            .where('group.id =:id', { id: req.query.group })
            .getOne()

    }

    let index = -1
    if (group) {
        index = group.admin.findIndex(user => user.id == req.currentUser!.id)
    }

    if (!deletedStatus || (req.currentUser!.id !== deletedStatus.creator.id && index === -1)) {
        throw new BadRequestError('Post not Found')
    }

    await getRepository(Status).delete([deletedStatus.id])
    res.json({})
})


// GET /api/status/
// Private
// Show All Status For The Moment 

export const getStatus = asyncHandler(async (req: Request, res: Response) => {
    // try to change of have a better solution but for moment make it like this

    // typeORM does'nt support  CASE in A ORDRERBY

    const skip = Number(req.query.skip) || 0


    let friends = req.currentUser!.friends.map(friend => friend.id)

    if (friends.length === 0) { friends = [0] }

    let group = req.currentUser!.groupMember.map(member => member.id)

    if (group.length === 0) { group = [0] }

    let page = req.currentUser!.page.map(page => page.id)

    if (page.length === 0) { page = [0] }

    let status = []
    let myStatus
    try {
        status = await getRepository(Users)
            .createQueryBuilder('users')
            .select(['users.id', 'users.name', 'users.image'])
            .leftJoinAndSelect('users.statusCreator', 'status')
            .leftJoinAndSelect('status.pageRoom', 'page')
            .leftJoinAndSelect('status.groupRoom', 'group')
            .leftJoinAndSelect('status.visitor', 'visitor')
            .orWhere('users.id IN (:...friends)', { friends: friends })
            .andWhere('status.creator = users.id ')
            .orWhere('page.id IN (:...page)', { page: page })
            .orWhere('group.id IN (:...group)', { group: group })
            .orderBy('status.createdAt', 'ASC')
            .take(10)
            .skip(10 * skip)
            .getMany()

        myStatus = skip === 0 ? await getRepository(Users)
            .createQueryBuilder('users')
            .leftJoinAndSelect('users.statusCreator', 'status')
            .leftJoinAndSelect('status.pageRoom', 'page')
            .leftJoinAndSelect('status.groupRoom', 'group')
            .where('status.creator = :userID ', { userID: req.currentUser!.id })
            .take(10)
            .skip(10 * skip)
            .orderBy('status.createdAt', 'ASC')
            .getOne() : null

    } catch (err) {
        throw new BadRequestError(err.message)
    }
    // think to make it better 
    status = status.map(Status => {
        Status.statusCreator.forEach((story: Status) => {
            const index = story.visitor.findIndex(visitor => visitor.id === req.currentUser!.id)

            story.visitor = index === -1 ? false : true
        })
        return Status
    })

    if (myStatus && myStatus.statusCreator.length > 0 && skip === 0) {
        status = [myStatus, ...status]
    }

    res.send({ status })
})


export const getMyStatus = asyncHandler(async (req: Request, res: Response) => {
    const skip = Number(req.query.skip) || 0

    let status
    try {
        status = await getRepository(Users)
            .createQueryBuilder('users')
            .leftJoinAndSelect('users.statusCreator', 'status')
            .leftJoinAndSelect('status.pageRoom', 'page')
            .leftJoinAndSelect('status.groupRoom', 'group')
            .where('status.creator = :userID ', { userID: req.currentUser!.id })
            .take(10)
            .skip(10 * skip)
            .orderBy('status.createdAt', 'ASC')
            .getOne()

    } catch (err) {
        throw new BadRequestError('something wrong in query')
    }
    res.send({ status })
})



// add seen to some status 
// POST /API/STATUS/:ID ID OF STATUS
// PRIVATE 
// DESC  ADD VIEW TO A CERTAIN STATUS

export const addSeen = asyncHandler(async (req: Request, res: Response) => {
    let status
    try {
        await getConnection()
            .createQueryBuilder()
            .relation(Status, 'visitor')
            .of(req.params.id)
            .add(req.currentUser)

    } catch (err) {
        status = err.message
    }
    res.send({
        status: status
    })
})


// get viwers of a certain post 
// GET /API/STATUS/:ID ID OF STATUS
// PRIVATE 

export const getVisitor = asyncHandler(async (req: Request, res: Response) => {
    let status
    try {
        status = await getRepository(Status)
            .createQueryBuilder('status')
            .leftJoinAndSelect('status.visitor', 'visitor')
            .leftJoinAndSelect('status.creator', 'creator')
            .where('status.id = :statusID', { statusID: req.params.id })
            .andWhere('creator.id = :creatorID', { creatorID: req.currentUser!.id })
            .getOne()

    } catch (err) {
        throw new BadRequestError(err.message)
    }
    if (!status) {
        throw new BadRequestError('something wrong happen')
    }
    res.send({
        visitor: status.visitor
    })
})
