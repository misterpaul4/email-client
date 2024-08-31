import { DynamicModule, Module } from '@nestjs/common';
import { GatewayClientController } from './gateway-client.controller';
import { GatewayClientService } from './gateway-client.service';
import { GATEWAY_CLIENT_OPTIONS } from '@constants';
import { IGatewayClientModuleOptions } from '@interfaces';
import { AccountModule } from '../account';

@Module({
  imports: [AccountModule],
  controllers: [GatewayClientController],
  providers: [GatewayClientService],
})
export class GatewayClientModule {
  static forRoot(options: IGatewayClientModuleOptions): DynamicModule {
    return {
      module: GatewayClientModule,
      providers: [
        {
          provide: GATEWAY_CLIENT_OPTIONS,
          useValue: options,
        },
      ],
      exports: [GATEWAY_CLIENT_OPTIONS],
    };
  }
}
