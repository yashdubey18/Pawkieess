import express from 'express';
import { protect } from '../middleware/auth.js';
import { getUserChats, getChatMessages, createChat, sendMessage } from '../controllers/chatController.js';

const router = express.Router();

router.use(protect);

router.get('/', getUserChats);
router.get('/:chatId/messages', getChatMessages);
router.post('/', createChat);
router.post('/message', sendMessage);

export default router;
