import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({
    description: 'The username of the message recipient',
    example: 'john_doe',
  })
  @IsString()
  @IsNotEmpty()
  recipientUsername: string;

  @ApiProperty({
    description: 'The content of the message',
    minLength: 1,
    maxLength: 500,
    example: 'Hello! How are you doing?',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(500)
  content: string;
}
