import { Injectable } from '@nestjs/common';
import { readFile, writeFile } from 'fs/promises';

export interface Message {
  id: string;
  content: string;
}

interface MessagesHashTable {
  [key: string]: Message;
}

// It will be added in DI (dependency injector) container by providers in module, when nest will see, that controller has dependencies (in their constructor arguments), nest will automatically create the instances of these classes (that are dependencies), and feed them to constructor of controller
@Injectable()
export class MessagesRepository {
  private async getMessages(): Promise<MessagesHashTable> {
    const contents = await readFile('messages.json', 'utf-8');
    return JSON.parse(contents) as MessagesHashTable;
  }

  public async findOne(id: string): Promise<Message> {
    const messages: MessagesHashTable = await this.getMessages();
    return messages[id];
  }

  public async findAll(): Promise<Message[]> {
    const messages: MessagesHashTable = await this.getMessages();

    return Object.values(messages);
  }

  public async create(content: string): Promise<void> {
    const messages: MessagesHashTable = await this.getMessages();
    const id = Math.floor(Math.random() * 999).toString();
    messages[id] = { id, content };

    await writeFile('messages.json', JSON.stringify(messages));
  }
}
