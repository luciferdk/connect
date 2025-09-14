import express from 'express';

import deleteUser from '../controller/deleteuser.controller';
import { verifyToken } from '../utils/session';

const router = express.Router();

router.post('/userdeleted', verifyToken, deleteUser);

export default router;

