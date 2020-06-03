import { Resolver, Query } from '@nestjs/graphql';
import { Public } from 'nestjs-keycloak';
import { GraphqlCtx, GraphqlCtxShape } from '../decorators';

@Resolver()
export class AppResolver {
  @Public()
  @Query((_returns) => Number)
  count(@GraphqlCtx() ctx: GraphqlCtxShape): number {
    const { session } = ctx.req;
    return session.count || 0;
  }
}
