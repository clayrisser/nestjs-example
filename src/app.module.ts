import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppResolver } from './resolvers/app.resolver';
import { AppService } from './services/app.service';
import { AuthModule } from './resolvers/auth/auth.module';
import { DateScalar } from './scalars/date.scalar';
import { UserModule } from './resolvers/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        autoSchemaFile: 'src/schema.graphql',
        debug: configService.get('GRAPHQL_DEBUG') === '1',
        playground: configService.get('PLAYGROUND_ENABLE') === '1',
        context: ({ req }): any => ({ req })
      }),
      inject: [ConfigService]
    }),
    AuthModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver, DateScalar]
})
export class AppModule {}
