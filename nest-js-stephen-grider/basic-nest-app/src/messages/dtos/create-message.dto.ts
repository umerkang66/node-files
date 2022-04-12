import { IsString } from 'class-validator';

// This will be applied as the type for req body in messages controller
export class CreateMessageDto {
  @IsString()
  content: string;
}
