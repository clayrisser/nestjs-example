import { CountModule } from './count';
import { CrudResolversModule } from '../generated/type-graphql';
import { PrismaModule } from './prisma';

export * from './auth';
export * from './axios';
export * from './count';
export * from './prisma';

export default [CountModule, PrismaModule, CrudResolversModule];
