import { Account } from '@entities';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  SoftRemoveEvent
} from 'typeorm';
import { MailerService } from '../mailer';

@EventSubscriber()
export class AccountSubscriber implements EntitySubscriberInterface<Account> {
  constructor(private mailerService: MailerService) {}
  async afterInsert(event: InsertEvent<Account>) {
    const repository = event.manager.getRepository(Account);
    const count = await repository.count();

    if (count === 1) {
      this.mailerService.setDefaults(event.entity);
    }
  }

  afterRemove(event: RemoveEvent<Account>) {
    this.mailerService.resetDefault(event?.entity?.id);
  }

  afterSoftRemove(event: SoftRemoveEvent<Account>) {
    this.mailerService.resetDefault(event.entity?.id);
  }
}
