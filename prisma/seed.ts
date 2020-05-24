import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

const logger = console;
const prisma = new PrismaClient();

(async () => {
  dotenv.config();
  logger.log('Seeding...');
  const fullnameArray = (process.env.SEED_ADMIN_FULLNAME || '').split(' ');
  const email = process.env.SEED_ADMIN_EMAIL;
  let firstname = fullnameArray.pop();
  let lastname = '';
  if (fullnameArray.length) {
    lastname = firstname;
    firstname = fullnameArray.join(' ');
  }
  const admin = await prisma.user.create({
    data: {
      email,
      firstname,
      lastname,
      password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // secret42
      role: 'USER'
    }
  });
  logger.log({ admin });
  await prisma.disconnect();
})().catch(logger.error);
