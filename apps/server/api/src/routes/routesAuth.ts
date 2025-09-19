import express from 'express';
import { authentic, logout, verify } from '../controller/auth.controller';
const router = express.Router();

router.post('/authentication', authentic);
router.get('/verifyToken', verify);
router.post('/degradeToken', logout);

export default router;
