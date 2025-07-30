import { PrismaClient } from '../generated/prisma';
import { Request, Response, NextFunction } from 'express';
import cloudinary from '../config/cloudinary';

const prisma = new PrismaClient();

//load sidebar of user details
export const getUsersForSideBar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const loggedInUserId = req.user!.id;
    const filteredUsers = await prisma.user.findMany({
      where: {
        id: {
          not: loggedInUserId,
        },
      },
      select: {
        id: true,
        name: true,
        profileUrl: true,
      },
    });

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log('error in userSideBar', error);
    next(error);
  }
};

//loading chat history of user and receiver
export const getMessages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user!.id;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: myId, recipientId: parseInt(userToChatId) },
          { senderId: parseInt(userToChatId), recipientId: myId },
        ],
      },
      orderBy: {
        timestamp: 'asc',
      },
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log('error while loading chat history', error);
    next(error);
  }
};

//send messages
export const sendMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { content, mediaType } = req.body;
    const { id: recipientId } = req.params;
    const senderId = req.user!.id;

    let mediaUrl;
    if (req.body.image) {
      const uploadResponse = await cloudinary.uploader.upload(req.body.image);
      mediaUrl = uploadResponse.secure_url;
    }

    const newMessage = await prisma.message.create({
      data: {
        senderId,
        recipientId: parseInt(recipientId),
        content,
        mediaUrl,
        mediaType: mediaType || 'text',
      },
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.log('error to send message', error);
    next(error);
  }
};
