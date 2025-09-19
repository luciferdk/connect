import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface UserSession {
  id: string;
  name?: string;
  mobile: string;
  bio?: string | null;
  profileUrl?: string | null;
}

interface JWTPayload {
  id: string; // ✅ store id directly
  iat?: number;
  exp?: number;
}

// 👇 Extend Express Request to allow req.user
declare module 'express-serve-static-core' {
  interface Request {
    user?: JWTPayload;
  }
}

// Generate session token (JWT)
export const generateToken = (user: UserSession, res: Response) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables.');
  }

  try {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // Set the cookie securely
    res.cookie('jwt', token, {
      httpOnly: false, // Prevents XSS
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    console.log('Token generated successfully', token);

    res.status(200).json({
      message: 'Authentication Successful',
      user,
    });
  } catch (error) {
    console.error('Token generation error:', error);
    res.status(500).json({ message: 'Authentication Unsuccessful' });
  }
};

// Verify the Token - Middleware
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.jwt;

  if (!token) {
    res.status(401).json({ error: 'Access denied. No token provided.' });
    return;
  }

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined in environment variables.');
    res.status(500).json({ error: 'Server configuration error.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;
    req.user = decoded; // ✅ req.user.id now exists
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token.' });
  }
};

// Logout: clear cookies
export const degradeToken = (res: Response) => {
  try {
    res.cookie('jwt', '', {
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.status(200).json({ message: 'Successful logout' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Unsuccessful logout' });
  }
};
