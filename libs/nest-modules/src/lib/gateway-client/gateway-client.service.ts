import { GATEWAY_CLIENT_OPTIONS } from '@constants';
import { WebSocketEvents } from '@enums';
import { GoogleOauthTokenResponse, IGatewayClientModuleOptions } from '@interfaces';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { io, Socket } from 'socket.io-client';

@Injectable()
export class GatewayClientService implements OnModuleInit {
  private server = '';
  private readonly logger = new Logger(GatewayClientService.name);
  private socket!: Socket;

  constructor(
    @Inject(GATEWAY_CLIENT_OPTIONS)
    private readonly options: IGatewayClientModuleOptions
  ) {
    if (!this.options) {
      this.logger.warn('Missing gateway client options');
    }

    this.server = options.serverUrl;
  }

  onModuleInit() {
    this.initializeConnection();
  }

  private initializeConnection() {
    this.socket = io(this.server, {
      transports: ['websocket'],
      path: '/ws',
      autoConnect: this.options.autoConnect,
    });

    this.socket.on('connect', () => {
      this.logger.log(`Connected to bridge server: ${this.socket.id}`);
    });

    this.socket.on(
      WebSocketEvents.OauthCred,
      (data: GoogleOauthTokenResponse, callback: (response: boolean) => void) => {
        this.logger.log(`Received message: ${data}`);
        // TODO: save credentials

        callback(true);
      }
    );

    this.socket.on('disconnect', () => {
      this.logger.warn('Disconnected from WebSocket server');
    });
  }

  connectToServer() {
    if (this.socket.connected) {
      return this.socket.id;
    }

    return new Promise((resolve, reject) => {
      this.socket.connect();

      const timeout = setTimeout(() => {
        reject(new Error('Unable to establish connection'));
      }, 5000);

      this.socket.on('connect', () => {
        clearTimeout(timeout);
        resolve(this.socket.id);
      });
    }).catch((error) => {
      this.logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.REQUEST_TIMEOUT);
    });
  }

  disconnectFromServer() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
