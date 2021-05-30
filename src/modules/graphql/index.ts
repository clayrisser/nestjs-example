import { Module } from '@nestjs/common';
import GraphbackModule from '~/modules/graphback';
import KeycloakModule from '~/modules/keycloak';
import GraphqlService from './graphql.service';

@Module({
  providers: [GraphqlService],
  exports: [GraphqlService],
  imports: [GraphbackModule, KeycloakModule]
})
export default class GraphqlModule {}

export { GraphqlService };
