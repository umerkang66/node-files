import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Query,
  Body,
  Delete,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/signup')
  public createUser(@Body() body: CreateUserDto): void {
    this.usersService.create(body.email, body.password);
  }

  @Get('/:id')
  public findUser(@Param('id') id: string) {
    return this.usersService.findOne(parseInt(id));
  }

  @Get()
  public findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Patch('/:id')
  public updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }

  @Delete('/:id')
  public removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }
}
