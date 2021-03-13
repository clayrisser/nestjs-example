import { Module } from '@nestjs/common';
import GraphbackModule from '~/modules/graphback';
import GraphqlService from './graphql.service';

@Module({
  providers: [GraphqlService],
  imports: [GraphbackModule]
})
export default class GraphqlModule {}

export { GraphqlService };
