import express from 'express';
import { protectRoute } from '../middleware/auth.middleware';
import {
  getMessages,
  getUsersForSideBar,
  sendMessages,
} from '../controller/message.controller';

const router = express.Router();


router.get('/users', protectRoute, getUsersForSideBar);

router.get('/:id', protectRoute, getMessages);

router.post('/send/:id', protectRoute, sendMessages);

export default router;
