// src/controller/message.controller.ts
import { PrismaClient } from '../generated/prisma';
import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';
import { getIo } from '../config/socket';

const prisma = new PrismaClient();

// NOTE: Fetches user's data and their contacts endpoint
export const getUsersForSideBar = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    // Fetch the logged-in user's details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        profileUrl: true,
        bio: true,
      },
    });

    if (!user) {
      // The `res.status().json()` call sends the response.
      // We just need to exit the function with a simple `return;`
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Fetch the user's saved contacts
    const contacts = await prisma.contact.findMany({
      where: { ownerId: userId },
      select: {
        // Using select to retrive scalar fields and the reloation
        id: true,
        nickName: true, //Retain the nicname from the Contact Model
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

    // Format the contacts data
    const formattedContacts = contacts.map((entry) => ({
      //Spread all fields from the actual User object (id,name,profileUrl, bio)
      ...entry.contact,
      //OverWrite/add the ncikname from the Contact Model
      nickName: entry.nickName,
    }));

    // Combine user's data and contacts into a single response
    const sidebarData = {
      user,
      contacts: formattedContacts,
    };

    // This line sends the final response. No `return` is needed here either.
    res.status(200).json(sidebarData);
  } catch (error) {
    console.error('Error in getUsersForSideBar:', error);
    // Send an error response. The function will implicitly end here.
    res.status(500).json({ message: 'Internal server error' });
  }
};

// NOTE: chat history display endpoint
export const getMessages = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const otherUserId = req.params.id;

    // Calculate 24 hours ago cutoff for deletion
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // STEP 1: Delete messages older than 24 hours (PERMANENT DELETE)
    await prisma.message.deleteMany({
      where: {
        AND: [
          {
            OR: [
              { senderId: userId, recipientId: otherUserId },
              { senderId: otherUserId, recipientId: userId },
            ],
          },
          {
            timestamp: { lt: twentyFourHoursAgo }, // older than 24 hours
          },
        ],
      },
    });

    // STEP 2: Fetch only messages from last 24 hours
    const messages = await prisma.message.findMany({
      where: {
        AND: [
          {
            timestamp: { gte: twentyFourHoursAgo }, // only last 24 hrs
          },
          {
            OR: [
              { senderId: userId, recipientId: otherUserId },
              { senderId: otherUserId, recipientId: userId },
            ],
          },
        ],
      },
      orderBy: { timestamp: 'asc' },
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log('error while loading chat history', error);
    res.status(500).json({ messages: 'failed to get messages' });
  }
};

// NOTE: send messages endpoint
export const sendMessages = async (req: Request, res: Response) => {
  const io = getIo();
  try {
    const { content, mediaBase64, mediaType } = req.body;
    const recipientId = req.params.id;
    const senderId = req.user!.id;

    let mediaUrl: string | undefined;

    if (mediaBase64) {
      const upload = await cloudinary.uploader.upload(mediaBase64, {
        resource_type: 'auto', //auto handle image, video, audio, docs
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
    });

    // Emit to recipient
    io.to(recipientId).emit('receive_message', newMessage);

    // Emit to sender for confirmation
    io.to(senderId).emit('message_sent', newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    console.log('error while sending message', error);
    res.status(500).json({ message: 'Message sending failed' });
  }
};
