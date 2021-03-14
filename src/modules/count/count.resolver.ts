import { Resolver, Query, Ctx } from 'type-graphql';
import { GraphqlCtx } from '~/types';

@Resolver()
export class CountResolver {
  @Query((_returns: any) => Number, { nullable: true })
  count(@Ctx() ctx: GraphqlCtx): string[] {
    return Object.keys(ctx);
  }
}
