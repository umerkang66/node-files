import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MessagesRepository } from './messages.repository';

@Module({
  controllers: [MessagesController],
  // Things that can be used as dependencies for other classes
  // Both of these classes have Injectable decorator
  providers: [MessagesService, MessagesRepository],
})
export class MessagesModule {}
