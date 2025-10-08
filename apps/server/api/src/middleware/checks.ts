import { Request, Response } from 'express';
import { verifyToken } from '../utils/session';

// ------------------ VERIFY TOKEN MIDDLEWARE ------------------
export const verify = async (req: Request, res: Response): Promise<void> => {
  try {
    //run the middleware manually
    await verifyToken(req, res, () => {
      res.status(200).json({ user: (req as any).user });
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(401).json({ error: 'Failed to verify token' });
    return;
  }
};
