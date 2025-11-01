import express from 'express';
import { updateUser,  contactName} from '../controller/update.controller';
import { verifyToken } from '../utils/session';
import multer from 'multer';


const router = express.Router();
const upload = multer({dest: 'upload/'});

router.put('/updateMySelf', verifyToken, upload.single('profileImage'), updateUser);
router.put('/updateNickName', verifyToken, contactName);

export default router;
