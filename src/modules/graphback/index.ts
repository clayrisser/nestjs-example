import { Module } from '@nestjs/common';
import GraphbackProvider from './graphback.provider';
import SchemaProvider from './graphbackSchema.provider';

@Module({
  providers: [GraphbackProvider, SchemaProvider],
  exports: [GraphbackProvider, SchemaProvider]
})
export default class GraphbackModule {}

export * from './graphback.provider';
export * from './graphbackSchema.provider';
export { GraphbackProvider, SchemaProvider };
