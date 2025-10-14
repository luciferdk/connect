import { Request, Response } from 'express';
import { generateToken, degradeToken } from '../utils/session';
import { sendOtp } from '../config/sendOtp';
import { redisClient } from '../config/redis';
import { PrismaClient } from '../generated/prisma';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

// Interface for user session
interface UserSession {
  id?: string; // id should be optional in request bodies
  mobile: string;
  name?: string;
  bio?: string | null;
  profileUrl?: string; // make optional, set default on register
  otp?: number; // optional, since step 1 request won’t have OTP
}

// ------------------ LOGIN ------------------
export const authentic = async (req: Request, res: Response): Promise<void> => {
  const { mobile, otp } = req.body as UserSession;

  if (!mobile) {
    res.status(400).json({ error: 'Mobile number is required' });
    return;
  }

  // Step 1 → Send OTP if no OTP provided
  if (!otp) {
    try {
      const message = await sendOtp(mobile);
      res.status(200).json({ message: `OTP sent to ${mobile}`, info: message });
      return;
    } catch (error) {
      console.error('OTP send error:', error);
      res.status(500).json({ message: 'Failed to send OTP' });
      return;
    }
  }

  try {
    // Step 2 → Verify OTP
    const storeOtp = await redisClient.get(`otp:${mobile}`);
    if (!storeOtp || storeOtp !== otp.toString()) {
      res.status(401).json({ error: 'Invalid or expired OTP' });
      return;
    }

    // Check if user exists
    let user = await prisma.user.findUnique({ where: { mobile } });

    if (!user) {
      res.status(404).json({ error: 'User not found, please register' });
      return;
    }

    // Delete OTP from redis after successful verification
    await redisClient.del(`otp:${mobile}`);

    // Generate JWT token
    await generateToken(user, res);
    res.status(200).json({ message: 'User Login successful!' });
    return;
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Server error' });
    return;
  }
};

// ------------------ REGISTER ------------------
export const register = async (req: Request, res: Response): Promise<void> => {
  const { mobile, name, bio, profileUrl } = req.body as UserSession;

  if (!mobile || !name) {
    res.status(400).json({ error: 'Mobile and Name are required' });
    return;
  }

  try {
    const finalProfileUrl =
      profileUrl ?? 'https://avatar.iran.liara.run/public';

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { mobile } });
    if (existingUser) {
      res.status(409).json({ error: 'User already exists' });
      return;
    }

    // Create new user
    const user = await prisma.user.create({
      data: { mobile, name, bio, profileUrl: finalProfileUrl },
    });

    await generateToken(user, res); // sets cookie internally
    res.status(201).json({ message: 'Created successfully' }); // only send JSON, don't include token
    return;
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Unable to create user in Database' });
    return;
  }
};

// ------------------ LOGOUT ------------------
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    await degradeToken(res);
    res.status(200).json({ message: 'You are logged out successfully' });
    return;
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
};


