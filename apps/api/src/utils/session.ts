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
  id: string;
  iat?: number;
  exp?: number;
}

// Extend Express Request to allow req.user
/*declare module 'express-serve-static-core' {
  interface Request {
    user?: JWTPayload;
  }
}
*/
// ---------------- GENERATE TOKEN ----------------
export const generateToken = (user: UserSession, res: Response): void => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables.');
  }

  // Generate JWT
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  // Set cookie with the token
  res.cookie('jwt', token, {
    httpOnly: true, // safer: prevents JS access
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  console.log('✅ Token generated for user:', user.id);
};

// ---------------- VERIFY TOKEN or Middleware ----------------
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.cookies?.jwt;

  if (!token) {
    res.status(401).json({ error: 'Access denied. No token provided.' });
    return;
  }

  if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET missing in environment variables');
    res.status(500).json({ error: 'Server configuration error.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;
    (req as any).user = decoded; // attach user payload to Request
    next(); //move to the route handler
  } catch (error) {
    console.error('❌ Token verification error:', error);
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

// ---------------- LOGOUT ----------------
export const degradeToken = (res: Response): void => {
  try {
    res.cookie('jwt', '', {
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  } catch (error) {
    console.error('❌ Logout error:', error);
    res.status(500).json({ message: 'Unsuccessful logout' });
  }
};
