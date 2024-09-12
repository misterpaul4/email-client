import { Account } from '@entities';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  SoftRemoveEvent,
} from 'typeorm';
import { MailerSmtpService } from '../mailer';
import { InjectDataSource } from '@nestjs/typeorm';

@EventSubscriber()
export class AccountSubscriber implements EntitySubscriberInterface<Account> {
  constructor(
    @InjectDataSource() readonly dataSource: DataSource,
    private mailerService: MailerSmtpService
  ) {
    dataSource.subscribers.push(this);
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
