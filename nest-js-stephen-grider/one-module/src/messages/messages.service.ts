import { Injectable } from '@nestjs/common';
import { MessagesRepository, Message } from './messages.repository';

// Our Application will interact with Services not Repositories
@Injectable()
export class MessagesService {
  constructor(private messagesRepo: MessagesRepository) {}

  async findOne(id: string): Promise<Message> {
    return await this.messagesRepo.findOne(id);
  }

  async findAll(): Promise<Message[]> {
    return await this.messagesRepo.findAll();
  }

  async create(content: string): Promise<void> {
    await this.messagesRepo.create(content);
  }
}
