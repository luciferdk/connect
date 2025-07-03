import express from 'express';
import { protectRoute } from '../middleware/auth.middleware';
import { getMessages, getUsersForSideBar } from '../controller/message.controller';

const routes = express.Router();

router.get('/users', protectRoute, getUserSideBar);
router.get('/:id', protectRoute, getMessages);

router.post('/send/:id', protectRoute, sendMessage);

export defult router;
