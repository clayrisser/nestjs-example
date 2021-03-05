import { GraphQLModule } from '@nestjs/graphql';
import { Module, Global } from '@nestjs/common';
import GraphbackModule from '~/modules/graphback';
import modules from '~/modules';
import { GraphqlService } from '~/modules/graphql';

@Global()
@Module({
  imports: [
    GraphQLModule.forRootAsync({
      imports: [GraphbackModule],
      useClass: GraphqlService
    }),
    ...modules
  ],
  providers: [],
  exports: []
})
export class AppModule {}
