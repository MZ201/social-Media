import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { Post } from '../entity/Post'
import { getConnection, getRepository } from 'typeorm'
import { BadRequestError } from '../error/badRequestError'
import { Page } from '../entity/Page'
import { Group } from '../entity/Group'
import { Comment } from '../entity/Comment'
import { Reaction } from '../entity/Reaction'


// POST /api/post
// PRIVATE 
//Created a post 
export const addPost = asyncHandler(async (req: Request, res: Response) => {
    let { body, groupRoom, pageRoom } = req.body
    let page, group

    if (pageRoom) {
        page = await getRepository(Page).findOne({
            id: Number(pageRoom)
        })
    }

    if (groupRoom) {
        group = await getRepository(Group)
            .createQueryBuilder('group')
            .leftJoinAndSelect('group.admin', 'admin')
            .leftJoinAndSelect('group.member', 'member')
            .where('group.id =:id', { id: groupRoom })
            .getOne()
    }

    body.isVideo = false
    if (body.video !== "") body.isVideo = true

    let allow = true

    pageRoom = page ? page.id : null

    groupRoom = group ? group.id : null

    if (group && group.admin.findIndex(admin => admin.id === req.currentUser!.id) === -1) {
        allow = false
    }

    const createdPost = await getRepository(Post).create({
        body: body, creator: req.currentUser, pageRoom, groupRoom, allow
    })

    // use Socket to send the notification to all users 
    await getRepository(Post).save(createdPost)
    res.json({})
})

// DELETE /api/post/id of group &&:id id of Post
// Private
// DELETE A POST BY WHO CREATED IT => delete all comment of the post to  
export const deletePost = asyncHandler(async (req: Request, res: Response) => {
    const deletedPost = await getRepository(Post).findOne(
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

    if (!deletedPost || (req.currentUser!.id !== deletedPost.creator.id && index === -1)) {
        throw new BadRequestError('Post not Found')
    }

    const deletedComment = await getRepository(Comment).find({
        relations: ['post'],
        where: [{
            post: Number(req.params.id)
        }]
    })
    await getRepository(Comment).remove(deletedComment)

    await getRepository(Post).delete(deletedPost)
    res.json({})
})


// GET /api/post/
// Private
// Show All Post For The  

export const getPost = asyncHandler(async (req: Request, res: Response) => {
    const skip = Number(req.query.skip) || 0

    let friends = req.currentUser!.friends.map(friend => friend.id)

    if (friends.length === 0) { friends = [0] }

    let group = req.currentUser!.groupMember.map(member => member.id)

    if (group.length === 0) { group = [0] }

    let page = req.currentUser!.page.map(page => page.id)

    if (page.length === 0) { page = [0] }

    let posts
    try {
        posts = await getRepository(Post)
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.creator', 'creator')
            .leftJoinAndSelect('post.pageRoom', 'page')
            .leftJoinAndSelect('post.groupRoom', 'group')
            .where('creator.id IN (:...friends)', { friends: friends })
            .orWhere('page.id IN (:...page)', { page: page })
            .orWhere('group.id IN (:...group)', { group: group })
            .take(10)
            .skip(10 * skip)
            .orderBy('post.createdAt', 'DESC')
            .getMany()
    } catch (err) {
        throw new BadRequestError(err.message)
    }
    res.send({ posts })
})


// GET /api/post/video
//PRIVATE
// show all of post for this id 
export const getVideoPost = asyncHandler(async (req: Request, res: Response) => {
    const skip = Number(req.query.skip) || 0

    let friends = req.currentUser!.friends.map(friend => friend.id)

    if (friends.length === 0) { friends = [0] }

    let group = req.currentUser!.groupMember.map(member => member.id)

    if (group.length === 0) { group = [0] }

    let page = req.currentUser!.page.map(page => page.id)

    if (page.length === 0) { page = [0] }

    let posts
    try {
        posts = await getRepository(Post)
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.creator', 'creator')
            .leftJoinAndSelect('post.pageRoom', 'page')
            .leftJoinAndSelect('post.groupRoom', 'group')
            .where(`post.body ::JSONB @>  :body`, {
                body: {
                    isVideo: true
                }
            })
            .orWhere('creator.id IN (:...friends)', { friends: friends })
            .orWhere('page.id IN (:...page)', { page: page })
            .orWhere('group.id IN (:...group)', { group: group })
            .take(10)
            .skip(10 * skip)
            .orderBy('post.createdAt', 'DESC')
            .getMany()

    } catch (err) {
        throw new BadRequestError('something wrong in query')
    }
    res.send({ posts })

})



// GET /api/post/group
//PRIVATE
// show all of post for a all group user in 

export const getGroupsPost = asyncHandler(async (req: Request, res: Response) => {

    const skip = Number(req.query.skip) || 0
    let group = req.currentUser!.groupMember.map(member => member.id)

    if (group.length === 0) { group = [0] }


    const posts = await getRepository(Post)
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.groupRoom', 'group')
        .where('group.id IN (:...group)', { group })
        .take(10)
        .skip(10 * skip)
        .orderBy('post.createdAt', 'DESC')
        .getMany()

    res.send({ posts })
})


// GET /api/post/statistic/:id 
// Private 
// GET statistuc about a certain post 
export const numberOfInteractionOfPost = asyncHandler(async (req: Request, res: Response) => {
    const Comments = await getRepository(Comment)
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.post', 'post')
        .where('post.id =:postID', { postID: req.params.id })
        .getCount()

    const reactions = await getRepository(Reaction)
        .createQueryBuilder('reaction')
        .leftJoinAndSelect('reaction.post', 'post')
        .where('post.id =:postID', { postID: req.params.id })
        .getCount()

    const share = await getRepository(Post)
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.share', 'share')
        .where('post.id = :postID', { postID: req.params.id })
        .getOne()
    if (!share) {
        throw new BadRequestError('post not found ')
    }
    res.send({ comments: Comments, reactions, share: share.share.length })
})


// POST /api/post/share
// Private 
// GET COMMENT UNDER  A COMMENT
export const sharePost = asyncHandler(async (req: Request, res: Response) => {
    const { postID } = req.body
    try {
        await getConnection()
            .createQueryBuilder()
            .relation(Post, 'share')
            .of(postID)
            .add(req.currentUser!)
    } catch (err) {
        throw new BadRequestError(err.message)
    }
    res.send({})
})

// DELETE /api/post/share
// Private 
// DELETE SHARE POST 
export const cancelShare = asyncHandler(async (req: Request, res: Response) => {
    const { postID } = req.body
    try {
        await getConnection()
            .createQueryBuilder()
            .relation(Post, 'share')
            .of(postID)
            .remove(req.currentUser!.id)

    } catch (err) {
        throw new BadRequestError(err.message)
    }
    res.send({})
})