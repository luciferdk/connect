import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';
import { PrismaClient } from '../generated/prisma';
const prisma = new PrismaClient();

export const updateBro = async (req: Request, res: Response) => {
  try {
    const { name, bio, profilePic } = req.body;
    const userId = req.user!.id;

    let profileUrl = null; // but never use it
    if (profilePic) {
      const upload = await cloudinary.uploader.upload(profilePic);
      profileUrl = upload.secure_url;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, bio, profileUrl },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Update failed' });
  }
};
