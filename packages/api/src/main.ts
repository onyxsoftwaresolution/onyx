import { ConfigService } from '@common/config/config.service';
import { PrismaService } from '@modules/prisma/prisma.service';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './modules/app/app.module';

export async function bootstrap(app: NestExpressApplication) {
  // Starts listening for shutdown hooks
  app.enableShutdownHooks();

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const config = app.get<ConfigService>(ConfigService);

  app.enableCors({
    origin: new RegExp(`${config.get('APP_URL_REGEX')}`),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  // app.enable('trust proxy');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(reflector, {
      enableImplicitConversion: true,
      // all fields should be excluded by default
      // unless otherwise stated by the @Expose() directive
      // this makes everything enforced
      strategy: 'excludeAll',
    }),
  );

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
}

(async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get<ConfigService>(ConfigService);

  await bootstrap(app);

  await app.listen(config.get('PORT'));
})();
