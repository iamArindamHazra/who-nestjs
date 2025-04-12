import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, ValidateNested } from 'class-validator';

export enum FilterOperator {
  EQUALS = 'eq',
  NOT_EQUALS = 'ne',
  CONTAINS = 'contains',
  SIMILAR = 'similar',
  GREATER_THAN = 'gt',
  GREATER_THAN_EQUALS = 'gte',
  LESS_THAN = 'lt',
  LESS_THAN_EQUALS = 'lte',
  IN = 'in',
  NOT_IN = 'nin',
}

export class FilterCondition {
  @ApiPropertyOptional({
    description: 'Field to filter on (can be nested using dot notation)',
    example: 'user.name',
  })
  field: string;

  @ApiPropertyOptional({
    enum: FilterOperator,
    description: 'Filter operator',
    example: FilterOperator.EQUALS,
  })
  @IsEnum(FilterOperator)
  operator: FilterOperator;

  @ApiPropertyOptional({
    description: 'Value to filter by',
    example: 'John',
  })
  value: any;
}

export class FilterDto {
  @ApiPropertyOptional({
    type: [FilterCondition],
    description: 'List of AND conditions',
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FilterCondition)
  and?: FilterCondition[];

  @ApiPropertyOptional({
    type: [FilterCondition],
    description: 'List of OR conditions',
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FilterCondition)
  or?: FilterCondition[];
}
