import { Provider } from '@entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProviderController } from './provider.controller';
import { ProviderService } from './provider.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Provider]), ConfigModule],
  controllers: [ProviderController],
  providers: [ProviderService],
  exports: [ProviderService]
})
export class ProviderModule {}
