import { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

const addNewContact = async (req: Request, res: Response) => {
  try {
    const ownerId = req.user!.id;
    const { mobile, nickName } = req.body;
    const contactUser = await prisma.user.findUnique({ where: { mobile } });

    if (!contactUser) {
      res.status(404).json({ message: 'user not found' });
      return;
    }

    if (contactUser.id === ownerId) {
      res.status(400).json({ message: 'Connot add yourself' });
      return;
    }

    const alreadyExists = await prisma.contact.findFirst({
      where: {
        ownerId,
        contactId: contactUser.id,
      },
    });

    if (alreadyExists) {
      res.status(400).json({ message: 'Already in Contact List' });
      return;
    }

    const newContact = await prisma.contact.create({
      data: {
        ownerId,
        contactId: contactUser.id,
	nickName: nickName,
      },
    });

    res.status(201).json(newContact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add contact' });
  }
};

export default addNewContact;
