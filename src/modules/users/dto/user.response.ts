import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  _id: string;

  @ApiProperty({ example: 'john_doe' })
  username: string;

  @ApiProperty({ example: 5 })
  messageCount: number;

  @ApiProperty({ example: '2025-04-12T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-04-12T10:00:00.000Z' })
  updatedAt: Date;
}

export class UsernameAvailabilityResponse {
  @ApiProperty({
    example: true,
    description: 'Whether the username is available',
  })
  available: boolean;
}
