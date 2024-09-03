import { GATEWAY_TIMEOUT } from '@constants';
import { WebSocketEvents } from '@enums';
import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface IEmitPayload {
  clientId: string;
  payload: any;
  event: WebSocketEvents;
}

@WebSocketGateway({
  transports: ['websocket'],
  path: '/ws',
})
export class GatewayService
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server!: Server;
  private readonly logger = new Logger(GatewayService.name);

  afterInit() {
    this.logger.log('Initialized websocket connection');
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log('Client connected: ', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected: ', client.id);
  }

  async emitAndWait<T>({ clientId, event, payload }: IEmitPayload): Promise<T> {
    return new Promise((resolve, reject) => {
      const client = this.server.sockets.sockets.get(clientId);

      if (!client) {
        reject(new Error('Client not found'));
        return;
      }

      client
        .timeout(GATEWAY_TIMEOUT)
        .emit(event, payload, (err: Error, response: T) => {
          if (response === true) {
            resolve(response);
          }

          if (err) {
            reject(err);
          }

          resolve(response);
        });
    });
  }

  emit({ clientId, payload, event }: IEmitPayload) {
    this.server.to(clientId).emit(event, payload);
  }
}
