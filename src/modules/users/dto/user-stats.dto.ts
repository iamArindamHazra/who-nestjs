import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../auth/enums/roles.enum';

export class UserStatsDto {
  @ApiProperty()
  username: string;

  @ApiProperty({ type: [String], enum: Role })
  roles: Role[];

  @ApiProperty()
  messageCount: number;

  @ApiProperty()
  lastActive: Date;

  @ApiProperty()
  isOnline: boolean;

  @ApiProperty()
  createdAt: Date;
}
