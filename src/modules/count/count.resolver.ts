import {
  Resolver,
  Query,
  Context,
  Mutation,
  Subscription
} from '@nestjs/graphql';
import { GraphqlCtx } from '~/types';

@Resolver()
export class CountResolver {
  @Query((_returns: any) => Number, { nullable: true })
  async count(@Context() ctx: GraphqlCtx): Promise<number> {
    console.log((await ctx.graphback.Note.findBy()).items);
    return Object.keys(ctx).length;
  }

  @Mutation((_returns: any) => Number, { nullable: true })
  mutationCount(@Context() ctx: GraphqlCtx): number {
    return Object.keys(ctx).length;
  }

  @Subscription((_returns: any) => Number, { nullable: true })
  subscriptionCount(@Context() ctx: GraphqlCtx): number {
    return Object.keys(ctx).length;
  }
}
