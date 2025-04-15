import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as ms from 'ms';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/modules/users/users.service';
import { CreateUserDto } from 'src/modules/auth/dto/create-user.dto';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { UpdateEmailDto } from 'src/modules/auth/dto/update-email.dto';
import {
  RefreshToken,
  RefreshTokenDocument,
} from './schemas/refresh-token.schema';
import { AuthTokensResponse } from 'src/modules/auth/dto/auth-tokens.response';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshTokenDocument>,
  ) {}

  async validateUser(identifier: string, password: string): Promise<any> {
    let user;
    // Try to find user by email first
    if (identifier.includes('@')) {
      try {
        user = await this.usersService.findByEmail(identifier);
      } catch (error) {
        // Convert NotFoundException to UnauthorizedException for login attempts
        if (error?.name === 'NotFoundException') {
          throw new UnauthorizedException();
        }
        throw error;
      }
    }

    // If user not found by email or identifier doesn't look like email, try username
    if (!user) {
      try {
        user = await this.usersService.findByUsername(identifier);
      } catch (error) {
        // Convert NotFoundException to UnauthorizedException for login attempts
        if (error?.name === 'NotFoundException') {
          throw new UnauthorizedException();
        }
        throw error;
      }
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _pass, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  private async generateTokens(
    userId: string,
    username: string,
  ): Promise<AuthTokensResponse> {
    const accessTokenExpiry = this.configService.get<string>(
      'JWT_ACCESS_EXPIRY',
      '1d',
    );
    const refreshTokenExpiry = this.configService.get<string>(
      'JWT_REFRESH_EXPIRY',
      '7d',
    );

    const payload = { username, sub: userId };
    const access_token = this.jwtService.sign(payload, {
      expiresIn: accessTokenExpiry,
    });

    const refresh_token = this.jwtService.sign(
      { ...payload, tokenType: 'refresh' },
      { expiresIn: refreshTokenExpiry },
    );

    // Store refresh token
    const expiresAt = new Date();
    expiresAt.setMilliseconds(
      expiresAt.getMilliseconds() + ms(refreshTokenExpiry),
    );

    await this.refreshTokenModel.create({
      userId,
      token: refresh_token,
      expiresAt,
    });

    const user = await this.usersService.findByUsername(username);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pass, ...userWithoutPassword } = user.toObject();
    return {
      access_token,
      refresh_token,
      expires_in: ms(accessTokenExpiry) / 1000,
      user: userWithoutPassword,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthTokensResponse> {
    const user = await this.validateUser(
      loginDto.identifier,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user._id.toString(), user.username);
  }

  async refreshToken(refreshToken: string): Promise<AuthTokensResponse> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      if (payload.tokenType !== 'refresh') {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const storedToken = await this.refreshTokenModel.findOne({
        token: refreshToken,
        isRevoked: false,
      });

      if (!storedToken) {
        throw new UnauthorizedException('Refresh token not found or revoked');
      }

      if (new Date() > storedToken.expiresAt) {
        await this.refreshTokenModel.deleteOne({ _id: storedToken._id });
        throw new UnauthorizedException('Refresh token expired');
      }

      // Revoke the used refresh token
      await this.refreshTokenModel.updateOne(
        { _id: storedToken._id },
        { isRevoked: true },
      );

      return this.generateTokens(payload.sub, payload.username);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async revokeAllRefreshTokens(userId: string): Promise<void> {
    await this.refreshTokenModel.updateMany(
      { userId, isRevoked: false },
      { isRevoked: true },
    );
  }

  async register(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pass, ...result } = user.toObject();
    return result;
  }

  async updateEmail(userId: string, updateEmailDto: UpdateEmailDto) {
    const user = await this.usersService.updateEmail(
      userId,
      updateEmailDto.email,
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pass, ...result } = user.toObject();
    return result;
  }
}
