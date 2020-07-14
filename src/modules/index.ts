import { AxiosModule } from './axios';
import { CountModule } from './count';
import { PrismaModule } from './prisma';

export * from './auth';
export * from './axios';
export * from './count';
export * from './prisma';

export default [AxiosModule, CountModule, PrismaModule];
