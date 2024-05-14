import express from 'express';
import { sendMessage,getAllMessages,deleteMessage, getSingleMessage,updateMessage } from '../controllers/communityChat.controller.js';


const router = express.Router();

router.post('/community/chat/:userId',sendMessage);
router.get('/community/chat/get/allposts/:userId',getAllMessages);
router.get('/community/chat/get/post/:userId/:messageId',getSingleMessage);
router.put('/community/chat/update/message/:userId/:messageId',updateMessage);
router.delete('/community/chat/delete/message/:userId/:messageId',deleteMessage);

export default router;