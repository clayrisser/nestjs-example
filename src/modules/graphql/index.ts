import { Module } from '@nestjs/common';
import GraphbackModule from '~/modules/graphback';
import GraphqlService from './service';

@Module({
  providers: [GraphqlService],
  imports: [GraphbackModule]
})
export default class GraphqlModule {}

export * from './service';
export { GraphqlService };
