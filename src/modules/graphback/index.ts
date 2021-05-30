import { Module } from '@nestjs/common';
import KeycloakModule from '~/modules/keycloak';
import GraphbackProvider from './graphback.provider';
import GraphbackSchemaProvider from './graphbackSchema.provider';

@Module({
  providers: [GraphbackProvider, GraphbackSchemaProvider],
  exports: [GraphbackProvider, GraphbackSchemaProvider],
  imports: [KeycloakModule]
})
export default class GraphbackModule {}

export * from './graphback.provider';
export * from './graphbackSchema.provider';
export { GraphbackProvider, GraphbackSchemaProvider };
