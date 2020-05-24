import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { PrismaService } from '../../services/prisma.service';
import { UserService } from '../../services/user.service';
import { PasswordService } from '../../services/password.service';

@Module({
  providers: [UserResolver, UserService, PasswordService, PrismaService]
})
export class UserModule {}
