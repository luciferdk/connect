import express from 'express';
import { verifyToken } from '../utils/session';
import {
  getMessages,
  getUsersForSideBar,
  sendMessages,
} from '../controller/message.controller';

const router = express.Router();

//sideBar
router.get('/users', verifyToken, getUsersForSideBar);
//retrive messages
router.get('/:id', verifyToken, getMessages);
//sendMessages
router.post('/send/:id', verifyToken, sendMessages);

export default router;
