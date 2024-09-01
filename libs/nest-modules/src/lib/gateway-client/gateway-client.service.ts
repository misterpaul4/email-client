import { GATEWAY_CLIENT_OPTIONS } from '@constants';
import {
  ConnectionType,
  ProviderDefaults,
  ProviderStatus,
  WebSocketEvents,
} from '@enums';
import {
  IGatewayClientModuleOptions,
  ProviderCallbackReponseData,
} from '@interfaces';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { io, Socket } from 'socket.io-client';
import { AccountService } from '../account';

@Injectable()
export class GatewayClientService implements OnModuleInit {
  private server = '';
  private readonly logger = new Logger(GatewayClientService.name);
  private socket!: Socket;

  constructor(
    @Inject(GATEWAY_CLIENT_OPTIONS)
    private readonly options: IGatewayClientModuleOptions,
    private accountService: AccountService
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
      async (
        data: ProviderCallbackReponseData,
        callback: (response: boolean) => void
      ) => {
        try {
          this.logger.log(`Received message: ${data}`);

          await this.accountService.createOrUpdateAccount({
            email: data.userInfo.email as string,
            fullName: data.userInfo.fullName,
            picture: data.userInfo.picture,
            identifier: data.userInfo.id,
            provider: {
              name: data.provider,
              connectionType: ConnectionType.oAuth,
              status: ProviderStatus.active,
              smtp: {
                host: ProviderDefaults[data.provider].host,
                port: ProviderDefaults[data.provider].port,
                ...data.config,
                data: data.payload,
              },
            },
          });
        } catch (error: any) {
          callback(error.message);
        }

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

  private disconnectFromServer() {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
  }
}
