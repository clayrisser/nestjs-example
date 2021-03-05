import { Module } from '@nestjs/common';
import GraphbackProvider from './provider';

@Module({
  providers: [GraphbackProvider],
  exports: [GraphbackProvider]
})
export default class GraphbackModule {}

export * from './provider';
export { GraphbackProvider };
