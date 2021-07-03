
import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { Post } from '../entity/Post'
import { Reaction, ReactionToComment } from '../entity/Reaction'
import { BadRequestError } from '../error/badRequestError'
import { getConnection, getRepository } from 'typeorm'
import { Comment } from '../entity/Comment'

// PUT /API/REACTION/?comment=10 && post =12 one of them enought and require
// Private
// reaction to a certain post 

export const addReaction = asyncHandler(async (req: Request, res: Response) => {
    const { reaction } = req.body

    let post, comment

    if ((!req.query.post && !req.query.comment) ||
        (req.query.comment && req.query.post)) {
        throw new BadRequestError('check your query')
    }

    if (req.query.post) {
        post = await getRepository(Post).findOne({ id: Number(req.query.post) })
        if (!post) {
            throw new BadRequestError('Post not Found')
        }
        try {
            await getConnection()
                .createQueryBuilder()
                .insert()
                .into(Reaction)
                .values({
                    created: req.currentUser!, post, reaction: reaction
                })
                .execute()
        } catch (err) {
            throw new BadRequestError(err.message)
        }
    }

    if (req.query.comment) {
        comment = await getRepository(Comment).findOne({ id: Number(req.query.comment) })
        if (!comment) {
            throw new BadRequestError('Comemnt not Found')
        }
        try {
            await getConnection()
                .createQueryBuilder()
                .insert()
                .into(ReactionToComment)
                .values({
                    created: req.currentUser!, comment, reaction: reaction
                })
                .execute()
        } catch (err) {
            throw new BadRequestError(err.message)
        }

    }

    res.json({})

})

// PUT /API/REACTION/:id id of a reaction
// Private
// reaction to a certain post post query check if it a reaction  to a  post or comment

export const updateReaction = asyncHandler(async (req: Request, res: Response) => {
    const { reaction } = req.body

    const Model = req.query.post ? Reaction : ReactionToComment

    await getConnection()
        .createQueryBuilder()
        .update(Model)
        .set({
            reaction
        })
        .where('id = :id', { id: Number(req.params.id) })
        .execute()

    res.send({})

})



// get /API/REACTION/ post and comment query
// Private
// get reaction  to a certain post 
export const getReaction = asyncHandler(async (req: Request, res: Response) => {
    let reaction
    const skip = Number(req.query.skip )  || 0 
    if ((!req.query.post && !req.query.comment) ||
        (req.query.comment && req.query.post)) {
        throw new BadRequestError('check your query')
    }


    if (req.query.post) {
        reaction = await getRepository(Reaction)
            .createQueryBuilder('reaction')
            .leftJoinAndSelect('reaction.created' , 'creator')
            .leftJoinAndSelect('reaction.post' , 'post')
            .select(['post.id', 'reaction.reaction'])
            .where('creator.id = :userID' , {userID :req.currentUser!.id})
            .limit(10)
            .skip(skip * 10)
            .getMany()

    }

    if (req.query.comment) {
        reaction = await getRepository(ReactionToComment)
            .createQueryBuilder('reaction')
            .leftJoinAndSelect('reaction.comment', 'comment')
            .select(['reaction.id', 'reaction.reaction'])
            .where('reaction.id = :userID' , {userID :req.currentUser!.id})
            .limit(4)
            .skip(4 * skip)
            .getMany()
    }

    res.json({ reaction })
})




// DELETE /API/REACTION/:id/
// Private
// reaction to a certain post 
export const deleteReaction= asyncHandler(async (req: Request, res: Response) => {
    if ((!req.query.post && !req.query.comment) ||
        (req.query.comment && req.query.post)) {
        throw new BadRequestError('check your query')
    }

    const Model = req.query.post === 'true' ? Reaction : ReactionToComment

    await getConnection()
        .createQueryBuilder()
        .delete()
        .from(Model)
        .where('id =:id', { id: Number(req.params.id) })
        .execute()

    res.send({})

})
