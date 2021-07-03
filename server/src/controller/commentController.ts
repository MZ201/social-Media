import { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import { Post } from "../entity/Post"
import { BadRequestError } from "../error/badRequestError"
import { getConnection, getRepository } from "typeorm"
import { Comment } from "../entity/Comment"
import { ReactionToComment } from "../entity/Reaction"

// POST /api/comment/:id && Id of Post 
// Private
// Create A comment
export const addComment = asyncHandler(async (req: Request, res: Response) => {
    const { body, ref } = req.body
    const post = await getRepository(Post)
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.pageRoom', 'page')
        .where('post.id =:id', { id: Number(req.params.id) })
        .getOne()
    if (!post) {
        throw new BadRequestError('Post not Found')
    }

    let comment


    if (ref) {
        comment = await getRepository(Comment)
            .createQueryBuilder('comment')
            .leftJoinAndSelect('comment.ref', 'ref')
            .where('comment.id =:commentID', { commentID: Number(ref) })
            .getOne()
    }


    const newComment = await getRepository(Comment).create({
        body,
        creator: req.currentUser,
        post,
        pageRoom: post.pageRoom,
    })


    await getRepository(Comment).save(newComment)

    if (comment) {
        try {
            await getConnection()
                .createQueryBuilder()
                .update(Comment)
                .set({
                    ref
                })
                .where('id = :id', { id: newComment.id })
                .execute()

        } catch (err) {
            throw new BadRequestError(err.message)
        }
    }

    res.json({})
})

// POST /api/comment/:id && Id of Comment 
// Private 
// Delete A comment
export const deleteComment = asyncHandler(async (req: Request, res: Response) => {
    const deletedComment = await getRepository(Comment).findOne({ id: Number(req.params.id) })
    if (!deletedComment) {
        throw new BadRequestError('no Comment Found')
    }
    await getRepository(Comment).remove(deletedComment)
    res.json({})
})



// POST /api/comment/?post=someID&&comment= someCommentID    && Id of Post
// Private 
// get COMMENT OF A POST
export const getCommentOfPost = asyncHandler(async (req: Request, res: Response) => {
    const skip = Number(req.query.skip) || 0
    let Comments
    try {
        Comments = await getRepository(Comment)
            .createQueryBuilder('comment')
            .leftJoin('comment.ref', 'ref')
            .leftJoinAndSelect('comment.post', 'post')
            .leftJoinAndSelect('ref.creator', 'refCreator')
            .leftJoinAndSelect('comment.creator', 'creator')
            .leftJoinAndSelect('comment.pageRoom', 'page')
            .where('post.id = :id ', { id: Number(req.params.id) })
            .andWhere('ref IS NULL')
            .take(3)
            .skip(3 * skip)
            .orderBy('comment.createdAt', "DESC")
            .getMany()
      
    } catch (err) {
        throw new BadRequestError(err.message)
    }
    if (!Comments) {
        throw new BadRequestError('not Found any Comments')
    }
    res.send({ comments: Comments })

})

// POST /api/comment/:id && Id of Comment
// Private 
// GET COMMENT UNDER  A COMMENT
export const getCommentOfComment = asyncHandler(async (req: Request, res: Response) => {
    const Comments = await getRepository(Comment)
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.ref', 'ref')
        .leftJoinAndSelect('comment.post', 'post')
        .leftJoinAndSelect('comment.creator', 'creator')
        .leftJoinAndSelect('comment.pageRoom', 'page')
        .where('ref.id = :commentID', { commentID: Number(req.params.id) })
        .orderBy('comment.createdAt', 'DESC')
        .getMany()

    if (!Comments) {
        throw new BadRequestError('not Found any Comments')
    }
    res.send({ comments: Comments })
})



// POST /api/comment/statistic/:id && Id of Comment
// Private 

// GET STATISTIC REACTION AND COMMENT IF !REQ.QUERY.COMMENT IF EXSIST ONLY  SSTATISTIC COMMENT 
// 
export const numberOfInteractionOfComment = asyncHandler(async (req: Request, res: Response) => {
    let Comments 

    try{
    Comments = await getRepository(Comment)
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.ref', 'ref')
        .select('ref.id')
        .addSelect('COUNT(ref.id)' , 'count')
        .groupBy('ref.id')
        .where('ref.id =:commentID', { commentID: req.params.id })
        .getRawOne()
    }catch(err){
        throw new BadRequestError(err.message)
    }
    // Reaction something ?
    let reactions
    if (!req.query.comment) {
        try {
            reactions = await getRepository(ReactionToComment)
                .createQueryBuilder('reaction')
                .leftJoinAndSelect('reaction.comment', 'comment')
                .select('reaction.reaction as reaction')
                .addSelect('COUNT(reaction.id)', 'count')
                .groupBy('reaction.reaction')
                .where('comment.id = :commentID', { commentID: req.params.id })
                .getRawMany()
        } catch (err) {
            throw new BadRequestError(err.message)
        }
    }


    res.send({ comments: Comments, reactions })
})





// POST /api/comment/?post=someID&&comment= someCommentID    && Id of Post
// Private 
// get COMMENT OF A POST
export const countCommentOfPost = asyncHandler(async (req: Request, res: Response) => {
    let count
    try {
        count = await getRepository(Comment)
            .createQueryBuilder('comment')
            .leftJoinAndSelect('comment.ref', 'ref')
            .leftJoinAndSelect('comment.post', 'post')
            .leftJoinAndSelect('ref.creator', 'refCreator')
            .where('post.id = :id ', { id: Number(req.params.id) })
            .andWhere('ref IS NULL')
            .getCount()

    } catch (err) {
        throw new BadRequestError(err.message)
    }
    res.send({ count: count  , postID : Number(req.params.id)})

})

