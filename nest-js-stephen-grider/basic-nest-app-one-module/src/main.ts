import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MessagesModule } from './messages/messages.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(MessagesModule);

  // By Integrating pipes globally, first request comes in, that req obj will be converted into the instance of a DTO (by class-transformer automatically), then it uses, class-validators, to validate the request body, if there are an validation errors, an error will be sent
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}

bootstrap();

// Create Controller: nest generate controller messages/messages --flat ==> "--flat" means don't create the new directory
