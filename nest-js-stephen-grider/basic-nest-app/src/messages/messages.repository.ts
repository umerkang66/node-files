import { readFile, writeFile } from 'fs/promises';

export interface Message {
  id: string;
  content: string;
}

interface MessagesHashTable {
  [key: string]: Message;
}

export class MessagesRepository {
  public async findOne(id: string): Promise<Message> {
    const contents = await readFile('messages.json', 'utf-8');
    const messages: MessagesHashTable = JSON.parse(contents);

    return messages[id];
  }

  public async findAll(): Promise<Message[]> {
    const contents = await readFile('messages.json', 'utf-8');
    const messages: MessagesHashTable = JSON.parse(contents);
    const messagesArr = Object.entries(messages).map(([_, value]) => value);

    return messagesArr;
  }

  public async create(content: string): Promise<void> {
    const contents = await readFile('messages.json', 'utf-8');
    const messages: MessagesHashTable = JSON.parse(contents);
    const id = Math.floor(Math.random() * 999).toString();

    messages[id] = { id, content };

    await writeFile('messages.json', JSON.stringify(messages));
  }
}
