// logout.controller.ts
import { Response } from 'express';
import { degradeToken } from '../utils/session';

export const logout = async (res: Response) => {
  try {
	  await degradeToken(res);
    res.status(200).json({ message: 'You are logged out successfully' });
  } catch (error) {
    console.error('Logout error: ', error);
    res.status(500).json({ message: 'internal server error' });
  }
};
