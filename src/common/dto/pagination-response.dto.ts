import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponseDto<T> {
  @ApiProperty({ description: 'Paginated data' })
  data: T[];

  @ApiProperty({ description: 'Starting index of the page', example: 0 })
  start: number;

  @ApiProperty({ description: 'Number of items per page', example: 20 })
  limit: number;

  @ApiProperty({
    description: 'Total number of items matching the filter criteria',
    example: 12,
  })
  filteredTotalRecords: number;

  @ApiProperty({
    description: 'Total number of items in the collection',
    example: 25,
  })
  totalRecords: number;
}
