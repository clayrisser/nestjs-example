import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthResolver } from './auth.resolver';
import { AuthService } from '../../services/auth.service';
import { GqlAuthGuard } from '../../guards/gql-auth.guard';
import { JwtStrategy } from './jwt.strategy';
import { PasswordService } from '../../services/password.service';
import { PrismaService } from '../../services/prisma.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('SECRET')
      }),
      inject: [ConfigService]
    })
  ],
  providers: [
    // AuthResolver,
    // AuthService,
    // GqlAuthGuard,
    // JwtStrategy,
    // PasswordService,
    // PrismaService
  ],
  exports: [GqlAuthGuard]
})
export class AuthModule {}
