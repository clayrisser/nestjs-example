import fs from 'fs-extra';
import path from 'path';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { SOFA_OPEN_API, SofaOpenApi } from '~/modules/sofa';

const pkg = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../../package.json')).toString()
);

export function registerSwagger(
  app: NestExpressApplication | NestFastifyApplication
) {
  const configService = app.get(ConfigService);
  if (configService.get('SWAGGER') === '1') {
    const sofaOpenApi: SofaOpenApi = app.get(SOFA_OPEN_API);
    const options = new DocumentBuilder()
      .setTitle(pkg.name)
      .setDescription(pkg.description)
      .setVersion(pkg.version)
      .build();
    const openApiObject = SwaggerModule.createDocument(app, options);
    const sofaOpenApiObject = sofaOpenApi.get();
    SwaggerModule.setup('api', app, {
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
      }
    });
  }
}
