import express from 'express';
import { authentic, logout } from '../controller/auth.controller';
import { protectRoute, checkAuth } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/authentication', authentic);

router.post('/logout', logout);

router.get('/check', protectRoute, checkAuth);

export default router;
