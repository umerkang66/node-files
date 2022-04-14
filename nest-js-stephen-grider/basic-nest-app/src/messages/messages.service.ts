import { MessagesRepository, Message } from './messages.repository';

// Our Application will interact with Services not Repositories
export class MessagesService {
  private messagesRepo: MessagesRepository;

  constructor() {
    // Service is creating its own dependencies
    // DONT DO THIS ON REAL APPLICATIONS
    this.messagesRepo = new MessagesRepository();
  }

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
