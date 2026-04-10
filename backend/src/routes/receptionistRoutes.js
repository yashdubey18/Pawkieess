import express from 'express';
import { receptionistChat } from '../controllers/receptionistController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/chat', protect, receptionistChat);

export default router;
