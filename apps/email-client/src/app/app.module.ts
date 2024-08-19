import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {MailerModule, AccountModule, ProviderModule} from '@nest-modules'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: "postgres",
          host: configService.get("DATABASE_HOST"),
          port: parseInt(configService.get("DATABASE_PORT") as string, 2),
          username: configService.get("DB_USERNAME"),
          password: configService.get("DATABASE_PASSWORD"),
          database: configService.get("DB_DATABASE"),
          schema: configService.get("DB_SCHEMA"),
          synchronize: true,
          autoLoadEntities: true,
        };
      },
      inject: [ConfigService],
    }),
    AccountModule,
    MailerModule,
    ProviderModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
