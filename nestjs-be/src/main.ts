import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NodeEnv } from '@utils/enums';
import { AppModule } from './app.module';
import { convertStringToLogLevelArray } from './functions/converters';

async function bootstrap() {
  const logLevels = convertStringToLogLevelArray(process.env.LOG_LEVELS);
  const app = await NestFactory.create(AppModule, { logger: logLevels });

  const configService = app.get(ConfigService);

  const appNodeEnv = configService.get<string>('app.nodeEnv');
  const isDevelopment = appNodeEnv === NodeEnv.DEV;
  const appShowSwagger = configService.get<boolean>('app.showSwagger');

  const appPort = configService.get<number>('app.port');

  await app.listen(appPort, () => {
    switch (appNodeEnv) {
      case NodeEnv.PROD:
        Logger.log('Application (PROD) running', 'NestApplication');
        break;
      case NodeEnv.DEV:
        Logger.log('Application (DEV) running', 'NestApplication');
        break;
      default:
        Logger.error('Environment not found', 'NestApplication');
    }
  });

  Logger.log(`Application is available on ${await app.getUrl()}`, 'NestApplication');
  if (isDevelopment || appShowSwagger) {
    Logger.log(`Documentation available under ${await app.getUrl()}/docs`, 'Swagger');
  }
}
bootstrap();
