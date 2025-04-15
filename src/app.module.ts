import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';
import configuration from 'src/config/configuration';
import { UsersModule } from 'src/modules/users/users.module';
import { MessagesModule } from 'src/modules/messages/messages.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService,
      ): Promise<ThrottlerModuleOptions> => ({
        throttlers: [
          {
            ttl: configService.get<number>('throttle.ttl'),
            limit: configService.get<number>('throttle.limit'),
          },
        ],
      }),
      inject: [ConfigService],
    }),
    CommonModule,
    UsersModule,
    MessagesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
