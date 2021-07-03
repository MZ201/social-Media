
import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { Group } from '../entity/Group'
import { getConnection, getRepository } from 'typeorm'
import { BadRequestError } from '../error/badRequestError'
import { Post } from '../entity/Post'
import { Comment } from '../entity/Comment'
import { Users } from '../entity/Users'



// POST API/GROUP 
//PRIVATE
// CREATE A GROUP BU A USER

export const addGroup = asyncHandler(async (req: Request, res: Response) => {
    const { name } = req.body

    const createdGroup = await getRepository(Group).create({
        name, admin: [req.currentUser!]
    })

    await getRepository(Group).save(createdGroup)

    res.send({ createdGroup })

})


// DELETE API/GROUP/:id  id : of group want to delete
// PRIVATE ? BUT ONLY FOR ADMINS
// DESC : DELETE  A GROUP BUT ALSO DELETE ALL POST AND THERE COMMENT BUT ONLY ADMIN

export const deleteGroup = asyncHandler(async (req: Request, res: Response) => {

    const deletedGroup = await getRepository(Group)
        .createQueryBuilder('group')
        .leftJoinAndSelect('group.admin', 'admin')
        .where('group.id =:id', { id: Number(req.params.id) })
        .getOne()

    if (!deletedGroup) {
        throw new BadRequestError('no Group  Exsist')
    }

    const index = deletedGroup.admin.findIndex(admin => admin.id == req.currentUser!.id)

    if (index === -1) {
        throw new BadRequestError('No group Found')
    }

    let posts: Post[]

    posts = await getRepository(Post)
        .createQueryBuilder('post')
        .innerJoinAndSelect('post.groupRoom', 'group')
        .where('post.groupRoom = :id', { id: Number(req.params.id) })
        .select('post')
        .addSelect('group.name')
        .getMany()


    let search = ''

    posts.forEach((post, index) => {
        search += post.id
        if (index != posts.length - 1) {
            search += ','
        }
    })

    if (posts.length > 0) {
        const comment = await getRepository(Comment)
            .createQueryBuilder('comment')
            .innerJoin('comment.post', 'post')
            .where(`comment.post IN (${search})`)
            .getMany()

        getRepository(Comment).remove(comment)
    }

    getRepository(Post).remove(posts)

    getRepository(Group).remove(deletedGroup)
    res.send({})

})



// PUT /API/GROUP/:ID ID : OF A GROUP 
//PRIVATE FOR ADMINS ONLY 
// DESC : CHANGE SOME SORT OF THING  ABOUT GROUP => like name and image and background image

export const updateGroup = asyncHandler(async (req: Request, res: Response) => {
    const { name, body } = req.body

    let change = {}

    if (name) {
        change = { ...change, name }
    }
    if (body) {
        change = { ...change, body }
    }

    const update = await getConnection()
        .createQueryBuilder()
        .update(Group)
        .set(change)
        .where("id = :id", { id: req.params.id })
        .execute()
    if (update.affected === 0) {
        throw new BadRequestError('Group not Found')
    }
    res.send({})
})

// GET /API/GROUP/:ID ID : OF A GROUP 
//  PRIVATE  
// DESC : GET THE GROUP 

export const getGroup = asyncHandler(async (req: Request, res: Response) => {
    const existedGroup = await getRepository(Group)
        .createQueryBuilder('group')
        .leftJoinAndSelect('group.admin', 'admin')
        .leftJoinAndSelect('group.member', 'member')
        .where('group.id =:id', { id: Number(req.params.id) })
        .select('group')
        .addSelect('member.name')
        .addSelect('admin.name')
        .getOne()

    if (!existedGroup) {
        throw new BadRequestError('Group not Found')
    }

    res.send({ existedGroup })
})

//PUT /API/GROUP/:ID/USER ID :ID OF A GROUP , ID OF A USER  SEND IN BODY
//  PRIVATE  FOR ADMIN 
// DESC : ADD A MEMBER OR ADMIN

export const addToGroup = asyncHandler(async (req: Request, res: Response) => {
    const { memberID, adminID } = req.body

    const existedGroup = await getRepository(Group)
        .createQueryBuilder('group')
        .leftJoinAndSelect('group.member', 'member')
        .leftJoinAndSelect('group.admin', 'admin')
        .where('group.id = :id', { id: Number(req.params.id) })
        .getOne()


    if (!existedGroup) {
        throw new BadRequestError('Group not Found')
    }
    const index = existedGroup.admin.findIndex(admin => admin.id === req.currentUser!.id)

    if (index === -1) {
        throw new BadRequestError('GROUP NOT FOUND')
    }

    let userID

    if (memberID) {
        userID = memberID
    }

    if (adminID) {
        userID = adminID
    }

    const user = await getRepository(Users)
        .createQueryBuilder()
        .where('id =:id', { id: userID })
        .getOne()

    if (!user) {
        throw new BadRequestError('no User Found')
    }

    if (memberID) existedGroup.member.push(user)

    if (adminID) existedGroup.admin.push(adminID)

    await getRepository(Group).save(existedGroup)

    res.send({ existedGroup })
})




//DELETE /API/GROUP/:ID/USER ID :ID OF A GROUP , ID OF A USER  SEND IN BODY
//  PRIVATE  FOR ADMIN 
// DESC : DELETE A MEMBER OR ADMIN

export const deleteFromGroup = asyncHandler(async (req: Request, res: Response) => {
    const { memberID, adminID } = req.body
    const existedGroup = await getRepository(Group)
        .createQueryBuilder('group')
        .leftJoinAndSelect('group.admin', 'admin')
        .leftJoinAndSelect('group.member', 'member')
        .where('group.id =:id', { id: Number(req.params.id) })
        .getOne()


    if (!existedGroup) {
        throw new BadRequestError('Group not Found')
    }

    const index = existedGroup.admin.findIndex(admin => admin.id == req.currentUser!.id)

    if (index === -1) {
        throw new BadRequestError('GROUP NOT FOUND')
    }
    if (memberID) {
        const member = existedGroup.member.filter(member => member.id === memberID)
        existedGroup.member = member
    }

    if (adminID) {
        const admin = existedGroup.admin.filter(admin => admin.id === adminID)
        existedGroup.admin = admin
    }

    getRepository(Group).save(existedGroup)
    res.send({})
})

// PUT /API/GROUP/:ID/POST ID : OF A GROUP // ID OF A POST IN THE BODY  
//  PRIVATE  FOR ADMIN 
// DESC : ALLOW A POST TO SHOW IN THE GROUP 

export const allowPost = asyncHandler(async (req: Request, res: Response) => {
    const { postID } = req.body


    const existedGroup = await getRepository(Group)
        .createQueryBuilder('group')
        .leftJoinAndSelect('group.admin', 'admin')
        .leftJoinAndSelect('group.member', 'member')
        .where('group.id =:id', { id: Number(req.params.id) })
        .getOne()


    if (!existedGroup) {
        throw new BadRequestError('Group not Found')
    }

    const index = existedGroup.admin.findIndex(admin => admin.id == req.currentUser!.id)

    if (index === -1) {
        throw new BadRequestError('GROUP NOT FOUND')
    }

    await getConnection()
        .createQueryBuilder()
        .update(Post)
        .set({ allow: true })
        .where('id = :id', { id: postID })
        .execute()

    res.send({})
})


// DELETE /API/GROUP/:ID/POST ID : OF A GROUP // ID OF A POST IN THE BODY  
//  PRIVATE  FOR ADMIN 
// DESC : DISALLOW A POST TO SHOW IN THE GROUP 

export const denyPost = asyncHandler(async (req: Request, res: Response) => {
    const { postID } = req.body

    const existedGroup = await getRepository(Group)
        .createQueryBuilder('group')
        .leftJoinAndSelect('group.admin', 'admin')
        .leftJoinAndSelect('group.member', 'member')
        .where('group.id =:id', { id: Number(req.params.id) })
        .getOne()


    if (!existedGroup) {
        throw new BadRequestError('Group not Found')
    }

    const index = existedGroup.admin.findIndex(admin => admin.id == req.currentUser!.id)

    if (index === -1) {
        throw new BadRequestError('GROUP NOT FOUND')
    }

    await getConnection()
        .createQueryBuilder()
        .delete()
        .from(Post)
        .where('id = :id', { id: postID })
        .execute()

    res.send({})
})



// get a post of a certain  group 
export const getGroupPost = asyncHandler(async (req: Request, res: Response) => {
    const {skip} = req.body

    const posts = await getRepository(Group)
                       .createQueryBuilder('group')
                       .leftJoinAndSelect('group.room' , 'room')
                       .where('room.groupRoom =:id' , {id : Number(req.params.id)})
                       .take(10)
                       .skip(10 * skip)
                       .getOne()

    if(!posts){
        throw new BadRequestError('no post refresh')
    }
    res.send({posts : posts.room})
})
