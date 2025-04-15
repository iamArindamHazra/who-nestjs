import { Module } from '@nestjs/common';
import { PaginationService } from 'src/common/services/pagination.service';

@Module({
  providers: [PaginationService],
  exports: [PaginationService],
})
export class CommonModule {}
