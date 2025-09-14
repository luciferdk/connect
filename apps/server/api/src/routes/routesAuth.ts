import express from 'express';
import { authentic, logout } from '../controller/auth.controller';
const router = express.Router();

router.post('/authentication', authentic);

router.post('/degradeToken', logout);

export default router;
