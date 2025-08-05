import express from 'express';
import { updateBro } from '../controller/update.controller';
import { protectRoute } from '../middleware/auth.middleware';

const router = express.Router();

router.put('/updateCredential', protectRoute, updateBro);


export default router;
