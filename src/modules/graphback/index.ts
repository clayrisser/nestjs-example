import { Module } from '@nestjs/common';
import GraphbackProvider from './provider';
import SchemaProvider from './schemaProvider';

@Module({
  providers: [GraphbackProvider, SchemaProvider],
  exports: [GraphbackProvider, SchemaProvider]
})
export default class GraphbackModule {}

export * from './provider';
export * from './schemaProvider';
export { GraphbackProvider, SchemaProvider };
