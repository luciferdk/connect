import express from 'express';
import { updateBro } from '../controller/update.controller';
import { verifyToken } from '../utils/session';

const router = express.Router();

router.put('/updateCredential', verifyToken, updateBro);


export default router;
