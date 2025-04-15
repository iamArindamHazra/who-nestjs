import { Controller, Get, Version } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller('/')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  @Version('1')
  @ApiOperation({
    summary: 'Get hello message (Public)',
    description: 'Returns a greeting message to verify the API is running',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a greeting message',
    schema: {
      type: 'string',
      example: 'Hello World!',
    },
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
