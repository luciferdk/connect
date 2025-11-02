import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();



export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as { id: string } | undefined; // cast user
    const userId = user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { name, bio, profileUrl } = req.body;
    const file = (req as any).file as Express.Multer.File | undefined;

    const updateData: {
      name?: string;
      bio?: string;
      profileUrl?: string;
    } = {};

    if (name?.trim()) updateData.name = name.trim();
    if (bio?.trim()) updateData.bio = bio.trim();

    if (file) {
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: 'user_profiles',
        resource_type: 'image',
      });
      updateData.profileUrl = uploadResult.secure_url;
    } else if (profileUrl?.trim()) {
      updateData.profileUrl = profileUrl.trim();
    }

    if (Object.keys(updateData).length === 0) {
      res.status(400).json({ message: 'No fields provided for update' });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};


export const contactName = async (req: Request, res: Response): Promise<void> => {
  try {
    const ownerId = req.user!.id;
    const { mobile, nickName } = req.body;

    // Validate required fields
    if (!mobile || !nickName) {
      res.status(400).json({ message: 'Mobile and nickname are required' });
      return;
    }

    // Find the contact user
    const contactUser = await prisma.user.findUnique({
      where: { mobile },
    });

    if (!contactUser) {
      res.status(404).json({ message: 'Contact User not found' });
      return;
    }

    // Check if contact relationship exists
    const existingContact = await prisma.contact.findUnique({
      where: {
        ownerId_contactId: {
          ownerId,
          contactId: contactUser.id,
        }
      }
    });

    if (!existingContact) {
      res.status(404).json({ message: 'Contact not found in your contact list' });
      return;
    }

    // Update the contact's nickname
    const updatedContact = await prisma.contact.update({
      where: {
        ownerId_contactId: {
          ownerId,
          contactId: contactUser.id,
        }
      },
      data: {
        nickName: nickName,
      },
    });

    res.status(200).json(updatedContact);
  } catch (error) {
    console.error(error);
    
    // Handle Prisma specific errors
    if (error instanceof Error) {
      if (error.message.includes('Record to update not found')) {
        res.status(404).json({ message: 'Contact not found in your contact list' });
        return;
      }
    }
    
    res.status(500).json({ message: 'Failed to update contact name' });
  }
};
