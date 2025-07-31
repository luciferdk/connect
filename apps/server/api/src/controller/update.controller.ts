import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();


export const updateBro = async (req: Request, res: Response) => {
  try {
    const { profilePic } = req.body;
    const userId = (req as any).user.id;

    if (!profilePic) {
      res.status(400).json({ message: 'Profile pic is required' });
      return;
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { profileUrl: uploadResponse.secure_url },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'internal server error' });
  }
};
