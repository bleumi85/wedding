import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NodeEnv } from '@utils/enums';
import { setupSwagger } from '@utils/setup-swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { convertStringToLogLevelArray } from './functions/converters';

const whiteList = ['https://api.diebleumers.de', 'https://hochzeit.diebleumers.de'];
const regexList = [/localhost:\d+$/, /\[::1\]:\d+/, /((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}:\d{4}$/];
const corsLogger = new Logger('CORS');

async function bootstrap() {
  const logLevels = convertStringToLogLevelArray(process.env.LOG_LEVELS);
  const app = await NestFactory.create(AppModule, { logger: logLevels });

  const configService = app.get(ConfigService);

  const appNodeEnv = configService.get<string>('app.nodeEnv');
  const isDevelopment = appNodeEnv === NodeEnv.DEV;
  const appShowSwagger = configService.get<boolean>('app.showSwagger');

  app.enableCors({
    credentials: true,
    origin: (origin, callback) => {
      if (origin === undefined) {
        corsLogger.debug('No origin');
        callback(null, true);
      } else if (regexList.some((regex) => regex.test(origin))) {
        corsLogger.debug(`RegexList: ${origin}`);
        callback(null, true);
      } else if (whiteList.indexOf(origin) !== -1) {
        corsLogger.debug(`WhiteList: ${origin}`);
        callback(null, true);
      } else {
        corsLogger.error('Not allowed');
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    exposedHeaders: ['Content-Disposition'],
  });

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  if (isDevelopment || appShowSwagger) {
    setupSwagger(app, isDevelopment);
  }

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
