import { Resolver, Query } from '@nestjs/graphql';
import { GraphqlCtx, GraphqlCtxShape } from '../../../decorators';

@Resolver()
export class CountResolver {
  @Query((_returns) => Number)
  count(@GraphqlCtx() ctx: GraphqlCtxShape): number {
    const { session } = ctx.req;
    session.count = ++session.count || 0;
    return session.count;
  }
}
