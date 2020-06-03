import { Resolver, Query } from '@nestjs/graphql';
import { GraphqlCtx, GraphqlCtxShape } from '../decorators';

@Resolver()
export class AppResolver {
  @Query((returns) => Number)
  count(@GraphqlCtx() ctx: GraphqlCtxShape): number {
    const { session } = ctx.req;
    console.log('user', ctx.req.user);
    console.log('session', session);
    return session.count;
  }
}
