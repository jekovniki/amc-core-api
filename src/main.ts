import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { useContainer } from 'class-validator';
import cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(new ValidationPipe());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? [
            'https://amc-ui-production.up.railway.app',
            'https://amc-ui-production.up.railway.app/',
            'https://app.amc-manager.com',
            'https://app.amc-manager.com/',
            'https://amc-manager.com',
            'https://amc-manager.com/',
          ]
        : true,
    credentials: true,
  }); // remove later
  await app.listen(3000);
}

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

bootstrap();
