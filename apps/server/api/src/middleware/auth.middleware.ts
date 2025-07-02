import { generatedToken } from './session';
import dotenv from 'dotenv';
dotenv.config();

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

export const protocatRoute = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    //get token from cookies
    const token = req.cookies.jwt;

    if (!token) {
      res.status(401).json({ message: 'Not authorize: No Token found' });
    }
    //get token from .env file
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is messing in environment');
    }

    //verify both token are match or not
    const decode: any = jwt.verify(toekn, process.env.JWT_SECRET);

    // find user by ID from token payload

    let user = await prisma.user.findUnique({
      wherer: { id: decode.userId }, // use userId from token
    });

    if (!user) {
      res.status(401).json({ message: 'User not found' });
    }

    //attach user to request
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: 'not authorized' });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.staus(200).json(req.user);
  } catch (error) {
    console.log('Error in checkAuth controller', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
