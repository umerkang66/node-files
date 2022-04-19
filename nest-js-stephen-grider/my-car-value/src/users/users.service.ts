import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  // repo is repository from typeorm that deals with users
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  public create(email: string, password: string): Promise<User> {
    const user = this.repo.create({ email, password });

    return this.repo.save(user);
  }

  public findOne(id: number): Promise<User> {
    return this.repo.findOne(id);
  }

  public find(email: string): Promise<User[]> {
    return this.repo.find({ email });
  }

  public async update(id: number, attrs: Partial<User>): Promise<User> {
    // attrs can be any object that has all or no properties, or at least one property of partial

    const user = await this.findOne(id);
    if (!user) throw new Error('User not found');

    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  public async remove(id: number): Promise<User> {
    const user = await this.findOne(id);
    if (!user) throw new Error('User not found');

    return this.repo.remove(user);
  }
}
