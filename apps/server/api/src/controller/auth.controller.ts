import { Request, Response } from 'express';
import { generateToken, degradeToken } from '../utils/session';
import { sendOtp } from '../config/sendOtp';
import { redisClient } from '../config/redis';
import { PrismaClient } from '../generated/prisma';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

// This interface now reflects the expected shape of req.body
interface UserSession {
  id: string;
  mobile: string;
  name: string;
  bio?: string | null;
  profileUrl?: string | null; // Corrected: profileImg -> profileUrl
  otp?: number; // Corrected: int -> number
}


// Corrected function signature for an Express route handler
export const authentic = async (req: Request, res: Response) => {
  //Destructure properties directly from req.body, and ensure correct field names
  const { mobile, otp, name, bio, profileUrl } = req.body as UserSession; // Cast req.body to UserData for type safety


  if (!otp) {
    // Basic validation for required fields
    try {
      const message = await sendOtp(mobile);
      res.status(200).json({ message });
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        res.status(400).json({ error: err.message });
      } else {
        res.status(500).json({ error: 'Unknown error occured' });
      }
    }
    return;
  }

  try {
    // Get OTP from redis
    const storeOtp = await redisClient.get(`otp:${mobile}`);
    // Ensure OTPs are compared as strings if storeOtp is a string
    if (storeOtp !== otp?.toString()) {
      // Convert otp to string for comparison if it's a number
      res.status(401).json({ error: ' Invalid or expired OTP ' });
      return;
    }

    // check if user exists
    let user = await prisma.user.findUnique({
      where: { mobile },
    });

    // if not present then create one
    if (!user) {
      try {
        //write a default url with dummy image
        const finalProfileUrl =
          profileUrl ?? 'https://example.com/default-profile.png'; //or any other default URL
        const justName = name ?? 'dhrup';
        user = await prisma.user.create({
          data: {
            mobile,
            name: justName,
            bio,
            profileUrl: finalProfileUrl,
          },
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to create user in Database' });
        return;
      }
    }

    await generateToken(user, res);

    // Delete OTP from redis after successful authentication
    await redisClient.del(`otp:${mobile}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
  
};


// logout.controller.ts
export const logout = async (res: Response) => {
  try {
    await degradeToken(res);
    res.status(200).json({ message: 'You are logged out successfully' });
  } catch (error) {
    console.error('Logout error: ', error);
    res.status(500).json({ message: 'internal server error' });
  }
};
