import { Module } from '@nestjs/common';
import services, { PrismaService } from './services';

@Module({
  providers: [...services],
  exports: [PrismaService]
})
export class PrismaModule {}
