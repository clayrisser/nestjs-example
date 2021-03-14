import { Module } from '@nestjs/common';
import { CountController } from './count.controller';
import { CountResolver } from './count.resolver';

@Module({
  controllers: [CountController],
  providers: [CountResolver]
})
export default class CountModule {}

export * from './count.controller';
export * from './count.resolver';
