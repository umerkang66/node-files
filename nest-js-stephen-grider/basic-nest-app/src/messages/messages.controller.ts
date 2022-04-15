import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { CreateMessageDto } from './dtos/create-message.dto';
import { Message } from './messages.repository';
import { MessagesService } from './messages.service';

@Controller('/messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get()
  public async getMessages(): Promise<Message[]> {
    return await this.messagesService.findAll();
  }

  // Body and Param are argument decorators
  @Post()
  public async createMessage(@Body() body: CreateMessageDto) {
    return await this.messagesService.create(body.content);
  }

  @Get('/:id')
  public async getMessage(@Param('id') id: string): Promise<Message> {
    const message = this.messagesService.findOne(id);
    if (!message) throw new NotFoundException('Message not Found');

    return message;
  }
}
