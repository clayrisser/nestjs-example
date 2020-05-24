import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

const logger = console;
const prisma = new PrismaClient();

(async () => {
  dotenv.config();
  logger.log('seeding . . .');
  const fullnameArray = (process.env.SEED_ADMIN_FULLNAME || '').split(' ');
  const email = process.env.SEED_ADMIN_EMAIL;
  let firstname = fullnameArray.pop();
  let lastname = '';
  if (fullnameArray.length) {
    lastname = firstname;
    firstname = fullnameArray.join(' ');
  }
  const users = await prisma.user.findMany({ first: 1 });
  if (users.length) {
    logger.log('already seeded');
  } else {
    const admin = await prisma.user.create({
      data: {
        email,
        firstname,
        lastname,
        password:
          '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // secret42
        role: 'ADMIN'
      }
    });
    logger.log({ admin: { ...admin, password: '***' } });
  }
  await prisma.disconnect();
})().catch(logger.error);
