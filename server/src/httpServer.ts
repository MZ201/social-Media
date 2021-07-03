// Library 
import express from 'express';
import dotenv from 'dotenv'
import morgan from 'morgan';
import cookieSession from "cookie-session"


import "reflect-metadata";
import { createConnection } from 'typeorm';
import asyncHandler from "express-async-handler"
// File 
import userRoute from './router/userRoutes'
import postRoute from './router/postRoutes'
import commentRoute from './router/commentRoutes'
import reactionRoute from './router/reactionRoutes'
import groupRoute from './router/groupRoutes'
import statusRoute from './router/statusRoutes'
import messageRoute from './router/messageRoutes'
import pageRoutes from './router/pageRoutes'
import interactRoute from './router/interactRoutes'

import { errorHandler } from "./middleware/error"
import { NotFoundError } from './error/notFound';
import cors from 'cors'

dotenv.config()

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials : true , 
};

const app = express()

createConnection().then(()/* connection */ => {

    app.use(express.json())

    app.set('trust proxy', 1) // trust first proxy

    app.use(cors(corsOptions))

    app.use(morgan('dev'))

    app.use(cookieSession({
        secure: false,
        signed: false , 
        name : "session" , 
    }))

    app.use('/api/user', userRoute)

    app.use('/api/post', postRoute)

    app.use('/api/comment', commentRoute)

    app.use('/api/reaction', reactionRoute)

    app.use('/api/group', groupRoute)

    app.use('/api/status', statusRoute)

    app.use('/api/message', messageRoute)

    app.use('/api/page', pageRoutes)

    app.use('/api/interact', interactRoute)

    app.all('*', asyncHandler(() => {
        throw new NotFoundError()
    }));

    app.use(errorHandler)

}).catch(error => console.log("TypeORM connection error: ", error));

export default app