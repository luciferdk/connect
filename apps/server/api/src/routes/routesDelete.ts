import express from 'express';

import deleteUser from '../controller/deleteuser.controller';
import {protectRoute} from '../middleware/auth.middleware';

const router = express.Router();

router.post('/userdeleted', protectRoute, deleteUser);

export default router;

