import dotenv from 'dotenv';
dotenv.config();

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

// ✅ Updated CustomRequest: no `null`, only `undefined` or a valid user object
//
//in the sence declearing the Coustorm Req or Request for user declear in globaly like given on the types/express.d.ts file
//
/* interface CustomRequest extends Request {
  user?: {
    id: number;
    name: string;
    mobile: string;
    bio: string | null;
    profileUrl: string | null;
  };
}
*/

// ✅ Middleware to protect routes
export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      res.status(401).json({ message: 'Not authorized: No Token found' });
      return;
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is missing in environment');
    }

    const decode: any = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decode.userId },
    });

    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    // ✅ Attach only the necessary fields
    req.user = {
      id: user.id,
      name: user.name,
      mobile: user.mobile,
      bio: user.bio,
      profileUrl: user.profileUrl,
    };

    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: 'Not authorized' });
  }
};

// ✅ Route to check auth
export const checkAuth = (req: Request, res: Response) => {
  try {
    //const user = (req as CustomRequest).user;
const user = req.user;
    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    res.status(200).json(user);
  } catch (error: any) {
    console.log('Error in checkAuth controller', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
