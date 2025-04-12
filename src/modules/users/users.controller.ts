import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  Version,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersDocs } from '../../docs/users.docs';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/roles.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserStatsDto } from './dto/user-stats.dto';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('all')
  @Version('1')
  @Roles(Role.SUPER_USER)
  @ApiOperation(UsersDocs.getAllUsers.operation)
  @ApiResponse(UsersDocs.getAllUsers.responses[200])
  @ApiResponse(UsersDocs.getAllUsers.responses[401])
  @ApiResponse(UsersDocs.getAllUsers.responses[403])
  async getAllUsers(): Promise<UserStatsDto[]> {
    return this.usersService.getAllUserStats();
  }

  @Get('check')
  @Version('1')
  @ApiOperation(UsersDocs.checkUsername.operation)
  @ApiQuery(UsersDocs.checkUsername.query.username)
  @ApiResponse(UsersDocs.checkUsername.responses[200])
  @ApiResponse(UsersDocs.checkUsername.responses[400])
  async checkUsername(
    @Query('username') username: string,
  ): Promise<{ available: boolean }> {
    return this.usersService.checkUsernameAvailability(username);
  }

  @Get('stats')
  @Version('1')
  @Roles(Role.SUPER_USER)
  @ApiOperation(UsersDocs.getAllUserStats.operation)
  @ApiResponse({
    ...UsersDocs.getAllUserStats.responses[200],
    type: UserStatsDto,
    isArray: true,
  })
  @ApiResponse(UsersDocs.getAllUserStats.responses[401])
  @ApiResponse(UsersDocs.getAllUserStats.responses[403])
  async getAllUserStats(): Promise<UserStatsDto[]> {
    return this.usersService.getAllUserStats();
  }

  @Get('info/:username')
  @Version('1')
  @ApiOperation(UsersDocs.findByUsername.operation)
  @ApiParam(UsersDocs.findByUsername.params.username)
  @ApiResponse(UsersDocs.findByUsername.responses[200])
  @ApiResponse(UsersDocs.findByUsername.responses[404])
  async findByUsername(@Param('username') username: string): Promise<User> {
    return this.usersService.findByUsername(username);
  }

  @Get('stats/:username')
  @Version('1')
  @Roles(Role.SUPER_USER)
  @ApiOperation(UsersDocs.getUserStats.operation)
  @ApiParam(UsersDocs.getUserStats.params.username)
  @ApiResponse(UsersDocs.getUserStats.responses[200])
  @ApiResponse(UsersDocs.getUserStats.responses[401])
  @ApiResponse(UsersDocs.getUserStats.responses[403])
  @ApiResponse(UsersDocs.getUserStats.responses[404])
  async getUserStats(
    @Param('username') username: string,
  ): Promise<UserStatsDto> {
    return this.usersService.getUserStats(username);
  }

  @Post('/promote/:username')
  @Version('1')
  @Roles(Role.SUPER_USER)
  @ApiOperation(UsersDocs.promoteToSuperUser.operation)
  @ApiParam(UsersDocs.promoteToSuperUser.params.username)
  @ApiResponse(UsersDocs.promoteToSuperUser.responses[200])
  @ApiResponse(UsersDocs.promoteToSuperUser.responses[401])
  @ApiResponse(UsersDocs.promoteToSuperUser.responses[403])
  @ApiResponse(UsersDocs.promoteToSuperUser.responses[404])
  async promoteToSuperUser(
    @Param('username') username: string,
  ): Promise<UserStatsDto> {
    return this.usersService.promoteToSuperUser(username);
  }

  @Delete('/demote/:username')
  @Version('1')
  @Roles(Role.SUPER_USER)
  @ApiOperation(UsersDocs.demoteFromSuperUser.operation)
  @ApiParam(UsersDocs.demoteFromSuperUser.params.username)
  @ApiResponse(UsersDocs.demoteFromSuperUser.responses[200])
  @ApiResponse(UsersDocs.demoteFromSuperUser.responses[401])
  @ApiResponse(UsersDocs.demoteFromSuperUser.responses[403])
  @ApiResponse(UsersDocs.demoteFromSuperUser.responses[404])
  async demoteFromSuperUser(
    @Param('username') username: string,
  ): Promise<UserStatsDto> {
    return this.usersService.demoteFromSuperUser(username);
  }
}
