import { Provider } from "@entities";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProviderController } from "./provider.controller";
import { ProviderService } from "./provider.service";

@Module({
  imports: [TypeOrmModule.forFeature([Provider])],
  controllers: [ProviderController],
  providers: [ProviderService]
})
export class ProviderModule {}
