import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(express.static('/Volumes/工作数据/tempNew/chat-assets'));
  app.enableCors({ origin: true, credentials: true });
  app.use(session({
    secret: 'atao',
    resave: false,
    saveUninitialized: true,
  }))
  await app.listen(3100);
}
bootstrap();
