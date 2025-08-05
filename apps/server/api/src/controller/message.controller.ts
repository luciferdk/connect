import { PrismaClient } from '../generated/prisma';
import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';
import { getIo } from '../config/socket';

const prisma = new PrismaClient();


//load sidebar of user details
export const getUsersForSideBar = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const contacts = await prisma.contact.findMany({
      where: { ownerId: userId },
      include: {
        contact: {
          select: {
            id: true,
            name: true,
            profileUrl: true,
            bio: true,
            mobile: true,
          },
        },
      },
    });

    const formattedContacts = contacts.map((entry) => entry.contact);
    res.status(200).json(formattedContacts);
  } catch (error) {
    console.log('error in userSideBar', error);
    res.status(500).json({ message: 'Internal message server error sidebar' });
  }
};

//loading chat history of user and receiver
export const getMessages = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const otherUserId = req.params.id;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, recipientId: otherUserId },
          { senderId: otherUserId, recipientId: userId },
        ],
      },
      orderBy: { timestamp: 'asc' },
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log('error while loading chat history', error);
    res.status(500).json({ messages: 'faield to get messages' });
  }
};

//send messages
export const sendMessages = async (req: Request, res: Response) => {
	const io = getIo();
  try {
    const { content, mediaBase64, mediaType } = req.body;
    const recipientId = req.params.id;
    const senderId = req.user!.id;

    let mediaUrl: string | undefined;

    if (mediaBase64) {
      const upload = await cloudinary.uploader.upload(mediaBase64, {
        resource_type: 'auto', //handles audio/video/image/doc
      });
      mediaUrl = upload.secure_url;
    }

    const newMessage = await prisma.message.create({
      data: {
        senderId,
        recipientId,
        content,
        mediaUrl,
        mediaType,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            mobile: true,
            profileUrl: true,
          },
        },
      },
    });

    //Emit to recipien'ts room
    io.to(recipientId).emit('recive_message', newMessage);

    //Also Emit to sender's room to update their own UI
    io.to(senderId).emit('message_send', newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    console.log('error while sending message', error);
    res.status(500).json({ message: 'Message sending failed' });
  }
};
