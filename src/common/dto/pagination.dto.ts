import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Starting index for pagination',
    default: 0,
    minimum: 0,
    example: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  start?: number = 0;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    default: 20,
    minimum: 1,
    example: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 20;

  @ApiPropertyOptional({
    description:
      'Sort configuration (prefix field with - for descending order)',
    example: '-price,createdAt',
  })
  @IsOptional()
  sort?: string;

  @ApiPropertyOptional({
    description: 'OR conditions (comma-separated filter expressions)',
    example: 'status:eq:completed,status:eq:shipped',
  })
  @IsOptional()
  or?: string;

  [key: string]: any; // Allow dynamic filter fields
}
