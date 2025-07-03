import { PrismaClient } from '../generated/prisma';
import dotenv from 'dotenv';

const prisma = new PrismaClient();


//loade sidebar of user details
export const getUsersForSideBar = async (req: Request, res: Response) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await prisma.User.find({
      _id: { $ne: loggedInUserId },
    }).select('-password');

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log('error in userSideBar', erro);
    res.status(500).json({ error: 'internal server error' });
  }
};




//loding chat history of user and reciver
export const getMessages = async (req: Request, req: Response) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await prisma.Messages.find({
      $or: [
        { senderId: myId, reciverId: userTochatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log('error while loding chat history', error);
    res.status(500).json({ error:'internal Server error'});
  }
};




//send messages and ressive
export const message = async () => {
  try {
    const { text, image, video } = req.body;
    const { id: reeiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      reciderId,
      text,
      image: imageUrl,
    });

    await newMessage.save();
  } catch (error) {
    console.log("error to send message", error);
    res.status(500).json({ error: "internal serverl error" });
  }
};
