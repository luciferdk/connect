import { PrismaClient } from '../generated/prisma';
import { Request, Response } from 'express';
const prisma = new PrismaClient();

const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    await prisma.message.deleteMany({
      where: {
        OR: [{ senderId: userId }, { recipientId: userId }],
      },
    });

    await prisma.contact.deleteMany({
      where: {
        OR: [{ ownerId: userId }, { contactId: userId }],
      },
    });

    await prisma.user.delete({
      where: { id: userId },
    });
    res.status(200).json({ message: 'user deleted Successfully' });
  } catch (error) {
    console.error(error, 'Deleting user Failed');
    res.status(500).json({ message: 'User deletation failed' });
  }
};

export default deleteUser;
