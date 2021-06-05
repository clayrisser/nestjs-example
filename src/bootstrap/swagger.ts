import fs from 'fs-extra';
import path from 'path';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { SOFA_OPEN_API, SofaOpenApi } from '~/modules/sofa';
import { HashMap } from '~/types';

const rootPath = path.resolve(__dirname, '../..');
const pkg = JSON.parse(
  fs.readFileSync(path.resolve(rootPath, 'package.json')).toString()
);

export function registerSwagger(
  app: NestExpressApplication | NestFastifyApplication
) {
  const configService = app.get(ConfigService);
  const clientSecret = configService.get('KEYCLOAK_CLIENT_SECRET');
  const scopes = [
    ...new Set([
      'openid',
      ...(configService.get('KEYCLOAK_SCOPES') || '')
        .split(' ')
        .filter((scope: string) => scope)
    ])
  ];
  if (
    configService.get('SWAGGER') === '1' ||
    configService.get('DEBUG') === '1'
  ) {
    const sofaOpenApi: SofaOpenApi = app.get(SOFA_OPEN_API);
    const options = new DocumentBuilder()
      .setTitle(pkg.name)
      .setDescription(pkg.description)
      .setVersion(pkg.version)
      .addOAuth2({
        name: 'Keycloak',
        type: 'oauth2',
        flows: {
          implicit: {
            authorizationUrl: `${configService.get(
              'KEYCLOAK_BASE_URL'
            )}/auth/realms/${configService.get(
              'KEYCLOAK_REALM'
            )}/protocol/openid-connect/auth?nonce=1`,
            scopes: scopes.reduce((scopes: HashMap, scope: string) => {
              scopes[scope] = true;
              return scopes;
            }, {})
          }
        }
      })
      .addBearerAuth()
      .addCookieAuth()
      .build();
    const openApiObject = SwaggerModule.createDocument(app, options);
    const sofaOpenApiObject = sofaOpenApi.get();
    const swaggerDocument = {
      ...sofaOpenApiObject,
      ...openApiObject,
      components: {
        ...sofaOpenApiObject.components,
        ...openApiObject.components,
        schemas: {
          ...(sofaOpenApiObject.components?.schemas || {}),
          ...(openApiObject.components?.schemas || {})
        }
      },
      paths: {
        ...sofaOpenApiObject.paths,
        ...openApiObject.paths
      },
      security: [
        {
          bearer: []
        }
      ]
    };
    SwaggerModule.setup('api', app, swaggerDocument, {
      customJs: '/swagger.js',
      swaggerOptions: {
        persistAuthorization: true,
        oauth: {
          clientId: configService.get('KEYCLOAK_CLIENT_ID'),
          ...(clientSecret ? { clientSecret } : {}),
          scopes: scopes.join(' ')
        }
      }
    });
  }
}
