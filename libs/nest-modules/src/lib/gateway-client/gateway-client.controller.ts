import { Controller, Post } from "@nestjs/common";
import { GatewayClientService } from "./gateway-client.service";

@Controller('gateway-client')
export class GatewayClientController {

  constructor(
    private readonly gatewayClientService: GatewayClientService
  ) {}

  @Post('connect')
  connect() {
    return this.gatewayClientService.connectToServer();
  }
}
