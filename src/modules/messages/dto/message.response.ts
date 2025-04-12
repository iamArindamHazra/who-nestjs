import { ApiProperty } from '@nestjs/swagger';

export class MessageResponse {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  _id: string;

  @ApiProperty({ example: 'john_doe' })
  recipientUsername: string;

  @ApiProperty({ example: 'Hello, how are you?' })
  content: string;

  @ApiProperty({ example: false })
  isRead: boolean;

  @ApiProperty({ example: '2025-04-12T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-04-12T10:00:00.000Z' })
  updatedAt: Date;
}
