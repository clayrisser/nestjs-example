import { Module } from '@nestjs/common';
import SofaModule from '~/modules/sofa';
import { SwaggerController } from './swagger.controller';

@Module({
  controllers: [SwaggerController],
  imports: [SofaModule]
})
export default class SwaggerModule {}

export * from './swagger.controller';
