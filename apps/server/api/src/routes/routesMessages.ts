import express from 'express';
import { protectRoute } from '../middleware/auth.middleware';
import {
  getMessages,
  getUsersForSideBar,
  sendMessage,
} from '../controller/message.controller';

const router = express.Router();

// @ts-ignore - Temporarily ignore TypeScript errors for async handlers
router.get('/users', protectRoute, getUsersForSideBar);
// @ts-ignore - Temporarily ignore TypeScript errors for async handlers
router.get('/:id', protectRoute, getMessages);
// @ts-ignore - Temporarily ignore TypeScript errors for async handlers
router.post('/send/:id', protectRoute, sendMessage);

export default router;
