import express from 'express';
const chatRouter=express.Router();
import { createConversationController,createConversationGet } from './controllers/chat.controller.js';
chatRouter.get('/conversation',createConversationGet);

chatRouter.post('/conversation',createConversationController)
export default chatRouter