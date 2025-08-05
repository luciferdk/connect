import { Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface UserSession {
  id: string; // prefer specific type
  name?: string;
  mobile: string;
  bio?: string | null;
  profileUrl?: string | null;
}

//Generate session token (e.g., JWT)
export const generateToken = (user: UserSession, res: Response) => {
  // Ensure JWT_SECRET is defined in your environment variables
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables.');
  }

  try {
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });
    //set the cookie securely
    res.cookie('jwt', token, {
      secure: false,
      sameSite: 'lax',
      //sameSite: 'strict', //CSRF Protacton
      maxAge: 7 * 60 * 60 * 1000,
    });
    console.log(token);
    //you may or may not want to send the token again in body
    res.status(200).json({
      message: 'Authentication Successful',
      user,
    });
  } catch {
    res.status(500).json({ message: 'Authentication Unsuccessfull' });
  }
};

//logout: clear cookies
export const degradeToken = (res: Response) => {
  try {
    res.cookie('jwt', '', { maxAge: 0 });
    res.status(200).json({ message: 'Successfull logout' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Unsuccesssfull logout' });
  }
};
