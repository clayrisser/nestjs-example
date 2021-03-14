import { Module } from '@nestjs/common';
import GraphbackProvider from './graphback.provider';
import GraphbackSchemaProvider from './graphbackSchema.provider';

@Module({
  providers: [GraphbackProvider, GraphbackSchemaProvider],
  exports: [GraphbackProvider, GraphbackSchemaProvider]
})
export default class GraphbackModule {}

export * from './graphback.provider';
export * from './graphbackSchema.provider';
export { GraphbackProvider, GraphbackSchemaProvider };
