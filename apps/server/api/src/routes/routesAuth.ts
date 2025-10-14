import express from 'express';
import { authentic, register, logout } from '../controller/auth.controller';
import { verify } from '../middleware/checks';



const router = express.Router();

router.post('/authentication', authentic);
router.post('/register', register);
router.get('/check', verify);
router.post('/degradeToken', logout);

export default router;
