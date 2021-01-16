import { ConfigModule } from './configuration';
import { CountModule } from './count';
import { PassportSessionModule, AuthModule } from './auth';
import { UserModule } from './user';

export default [
  AuthModule,
  ConfigModule,
  CountModule,
  PassportSessionModule,
  UserModule
];
