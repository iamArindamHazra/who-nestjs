import {
  Controller,
  Post,
  Body,
  UseGuards,
  Version,
  Patch,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthTokensResponse } from './dto/auth-tokens.response';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthDocs } from '../../docs/auth.docs';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Version('1')
  @ApiOperation(AuthDocs.register.operation)
  @ApiBody({ type: CreateUserDto })
  @ApiResponse(AuthDocs.register.responses[201])
  @ApiResponse(AuthDocs.register.responses[409])
  @ApiResponse(AuthDocs.register.responses[400])
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @Version('1')
  @ApiOperation(AuthDocs.login.operation)
  @ApiBody({ type: LoginDto })
  @ApiResponse(AuthDocs.login.responses[200])
  @ApiResponse(AuthDocs.login.responses[401])
  async login(@Body() loginDto: LoginDto): Promise<AuthTokensResponse> {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @Version('1')
  @ApiOperation(AuthDocs.refresh.operation)
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse(AuthDocs.refresh.responses[200])
  @ApiResponse(AuthDocs.refresh.responses[401])
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthTokensResponse> {
    return this.authService.refreshToken(refreshTokenDto.refresh_token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @Version('1')
  @ApiBearerAuth()
  @ApiOperation(AuthDocs.logout.operation)
  @ApiResponse(AuthDocs.logout.responses[200])
  @ApiResponse(AuthDocs.logout.responses[401])
  async logout(@Request() req) {
    await this.authService.revokeAllRefreshTokens(req.user.userId);
    return { message: 'Successfully logged out' };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-email')
  @Version('1')
  @ApiBearerAuth()
  @ApiOperation(AuthDocs.updateEmail.operation)
  @ApiBody({ type: UpdateEmailDto })
  @ApiResponse(AuthDocs.updateEmail.responses[200])
  @ApiResponse(AuthDocs.updateEmail.responses[409])
  @ApiResponse(AuthDocs.updateEmail.responses[401])
  async updateEmail(@Request() req, @Body() updateEmailDto: UpdateEmailDto) {
    return this.authService.updateEmail(req.user.userId, updateEmailDto);
  }
}
