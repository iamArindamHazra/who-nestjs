import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class SortField {
  @IsEnum(SortOrder)
  order: SortOrder;
}

export class SortDto {
  @ApiPropertyOptional({
    description:
      'Sort configuration where key is the field name (can be nested using dot notation) and value is the sort order',
    example: { 'user.name': 'asc', createdAt: 'desc' },
    type: 'object',
    additionalProperties: { enum: ['asc', 'desc'] },
  })
  @IsOptional()
  sort?: Record<string, SortOrder>;
}
