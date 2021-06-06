import { Module } from '@nestjs/common';
import GraphbackModule from '~/modules/graphback';
import KeycloakModule from '~/modules/keycloak';
import GraphqlSchemaService from './graphqlSchema.service';
import GraphqlService from './graphql.service';

@Module({
  providers: [GraphqlService, GraphqlSchemaService],
  exports: [GraphqlService, GraphqlSchemaService],
  imports: [GraphbackModule, KeycloakModule]
})
export default class GraphqlModule {}

export { GraphqlService, GraphqlSchemaService };
