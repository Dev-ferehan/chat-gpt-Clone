import express from 'express'
import chatRouter from './Chat/chat.routes.js';
const mainRouter=express.Router();
mainRouter.use('/chat',chatRouter);
export default mainRouter