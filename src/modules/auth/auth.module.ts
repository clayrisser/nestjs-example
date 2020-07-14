import { Module } from '@nestjs/common';
import controllers from './controllers';
import services, { AuthService } from './services';

@Module({
  providers: [...services],
  controllers,
  exports: [AuthService]
})
export class AuthModule {}
