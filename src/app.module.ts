import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MailerModule } from "./core-modules";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make the configuration available globally
      load: [
        () => ({
          DATABASE_HOST: process.env.JWT_SECRET,
          DATABASE_PORT: process.env.JWT_EXPIRY,
          DB_USERNAME: process.env.DB_USERNAME,
          DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
          DB_DATABASE: process.env.DB_DATABASE,
        }),
      ],
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {

        return {
          type: 'postgres',
          host: configService.get<string>('DATABASE_HOST'),
          port: parseInt(configService.get<string>('DATABASE_PORT'), 10),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DATABASE_PASSWORD') || null,
          database: configService.get<string>('DB_DATABASE'),
          synchronize: true,
          autoLoadEntities: true,
        }
      },
      inject: [ConfigService],
    }),
    MailerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
