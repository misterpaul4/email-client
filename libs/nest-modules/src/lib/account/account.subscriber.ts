import { Account } from '@entities';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  SoftRemoveEvent,
} from 'typeorm';
import { MailerService } from '../mailer';
import { InjectDataSource } from '@nestjs/typeorm';
import { DefaultProviderHostPort } from '@enums';

@EventSubscriber()
export class AccountSubscriber implements EntitySubscriberInterface<Account> {
  constructor(
    @InjectDataSource() readonly dataSource: DataSource,
    private mailerService: MailerService
  ) {
    dataSource.subscribers.push(this);
  }

  beforeInsert(event: InsertEvent<Account>){
    const { smtp, name: providerName} = event.entity.provider

    if (smtp) {
      const { host: defaultHost, port: defaultPort } = DefaultProviderHostPort[providerName]

      if (!smtp.host) {
        event.entity.provider.smtp.host = defaultHost;
      }

      if (!smtp.port) {
        event.entity.provider.smtp.port = defaultPort;
      }
    }
  }

  afterInsert(event: InsertEvent<Account>) {
    if (event.metadata.targetName === Account.name) {
      const hasDefaultAccount = this.mailerService.getDefaultAccount();

      if (!hasDefaultAccount.data) {
        this.mailerService.setDefaults(event?.entity);
      }
    }
  }

  afterRemove(event: RemoveEvent<Account>) {
    this.mailerService.resetDefault(event?.entity?.id);
  }

  afterSoftRemove(event: SoftRemoveEvent<Account>) {
    this.mailerService.resetDefault(event.entity?.id);
  }
}
