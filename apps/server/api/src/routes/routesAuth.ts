import express from 'express';
import { logout } from '../controller/logout.controller';
import { authentic } from '../controller/auth.controller';
import { updateBro } from '../controller/update.controller';
import { protectRoute, checkAuth } from '../middleware/auth.middleware';



const router = express.Router();


router.post('/authentication', authentic);

router.post('/logout', logout);

router.put('/updateCredential', protectRoute, updateBro);

router.get('/check', proctectRoute, checkAuth);

export default router;
