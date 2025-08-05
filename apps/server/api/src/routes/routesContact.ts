import express from 'express';
import  addNewContact  from '../controller/contact.controller';
import { protectRoute } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/addcontact', protectRoute, addNewContact);

export default router;
