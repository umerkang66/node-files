import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CreateMessageDto } from './dtos/create-message.dto';

@Controller('/messages')
export class MessagesController {
  @Get()
  public getMessages(): string {
    return 'These are the messages';
  }

  // Body and Param are argument decorators
  @Post()
  public createMessage(@Body() body: CreateMessageDto) {
    console.log(body);
  }

  @Get('/:id')
  public getMessage(@Param('id') id: string): string {
    console.log(id);
    return 'This is the single message';
  }
}
