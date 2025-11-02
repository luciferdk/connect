import express from 'express';
import  addNewContact  from '../controller/contact.controller';
import { verifyToken } from '../utils/session';

const router = express.Router();

router.post('/addcontact', verifyToken, addNewContact);

export default router;
