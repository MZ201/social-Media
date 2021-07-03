
import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { Page } from '../entity/Page'
import { getConnection, getRepository } from 'typeorm'
import { BadRequestError } from '../error/badRequestError'
import { Post } from '../entity/Post'
import { Comment } from '../entity/Comment'



// POST API/PAGE 
//PRIVATE
// CREATE A GROUP BU A USER

export const createPage = asyncHandler(async (req: Request, res: Response) => {
    const { name } = req.body

    await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Page)
        .values({
            name,
            creator: req.currentUser
        })
        .execute()
    res.send({})

})


// DELETE API/GROUP/:id  id : of page want to delete
// PRIVATE ? BUT ONLY FOR WHO CREATE IT 
// DESC : DELETE  A PAGE BUT ALSO DELETE ALL POST AND THERE COMMENT BUT ONLY ADMIN

export const deletePage = asyncHandler(async (req: Request, res: Response) => {

    const deletedPage = await getRepository(Page).findOne({
        where: [{
            id: Number(req.params.id)
        }]
    })

    if (!deletedPage) {
        throw new BadRequestError('no Page  Exsist')
    }



    let posts: Post[]

    posts = await getRepository(Post)
        .createQueryBuilder('post')
        .innerJoinAndSelect('post.pageRoom', 'page')
        .where('post.pageRoom = :id', { id: Number(req.params.id) })
        .select('post')
        .addSelect('page.name')
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
            .innerJoinAndSelect('comment.post', 'post')
            .where(`comment.post IN(${search})`)
            .getMany()

        await getRepository(Comment).remove(comment)
    }

    await getRepository(Post).remove(posts)

    await getRepository(Page).remove(deletedPage)
    res.send({})

})


// PUT /API/GROUP/:ID ID : OF A GROUP 
//PRIVATE FOR ADMINS ONLY 
// DESC : CHANGE SOME SORT OF THING  ABOUT GROUP => like name and image and background image

export const updatePage = asyncHandler(async (req: Request, res: Response) => {
    const { name, image, backgroundImage } = req.body
    let change = {}
    if (name) {
        change = { ...change, name }
    }

    if (image) {
        change = { ...change, image }
    }

    if (backgroundImage) {
        change = { ...change, backgroundImage }
    }

    const update = await getConnection()
        .createQueryBuilder()
        .update(Page)
        .where('id = :id', { id: req.params.id })
        .set(change)
        .execute()


    if (update.affected === 0) {
        throw new BadRequestError('Page not Found')
    }
    res.send({})
})



// PUT /API/GROUP/:ID ID : OF A GROUP 
//PRIVATE FOR ADMINS ONLY 
// DESC : CHANGE SOME SORT OF THING  ABOUT GROUP => like name and image and background image
export const likePage = asyncHandler(async (req: Request, res: Response) => {
    const update = await getRepository(Page)
        .createQueryBuilder('page')
        .leftJoinAndSelect('page.followers', 'followers')
        .where('page.id = :id', { id: Number(req.params.id) })
        .getOne()

    if (!update) {
        throw new BadRequestError('page not Found')
    }

    update.followers.push(req.currentUser!)

    await getRepository(Page).save(update)

    res.send({})

})


// PUT /API/GROUP/:ID/dislike ID :  ID OF A PAGE 
//PRIVATE FOR WHO FOLLOW A PAGE
// DESC : C
export const dislikePage = asyncHandler(async (req: Request, res: Response) => {
    const update = await getRepository(Page)
        .createQueryBuilder('page')
        .leftJoinAndSelect('page.followers', 'followers')
        .where('page.id = :id', { id: Number(req.params.id) })
        .getOne()

    if (!update) {
        throw new BadRequestError('page not Found')
    }

    update.followers = update.followers.filter(User => User.id !== req.currentUser!.id)

    await getRepository(Page).save(update)

    res.send({})

})


// GET /API/GROUP/:ID ID : OF A GROUP 
//PRIVATE FOR ADMINS ONLY 
// DESC : get a page 
export const getPage = asyncHandler(async (req: Request, res: Response) => {
    const page = await getRepository(Page)
        .createQueryBuilder('page')
        .leftJoinAndSelect('page.followers', 'followers')
        .where("page.id =:id", { id: req.params.id })
        .getOne()
    res.send({ page })
})


// get all post of a certain page

export const getPagePost = asyncHandler(async (req: Request, res: Response) => {
    const {skip} = req.body

    const posts = await getRepository(Page)
                       .createQueryBuilder('page')
                       .leftJoinAndSelect('page.room' , 'room')
                       .where('room.pageRoom =:id' , {id : Number(req.params.id)})
                       .take(10)
                       .skip(10 * skip)
                       .getOne()

    console.log(posts)

    if(!posts){
        throw new BadRequestError('no post refresh')
    }
    res.send({posts : posts})
})
//