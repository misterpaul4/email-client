import { Account } from '@entities';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  SoftRemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { MailerService } from '../mailer';

@EventSubscriber()
export class AccountSubscriber implements EntitySubscriberInterface<Account> {
  constructor(private mailerService: MailerService) {}
  beforeInsert(event: InsertEvent<Account>) {
    this.applyEffectOnDefaultChange(event.entity);
  }

  beforeUpdate(event: UpdateEvent<Account>) {
    this.applyEffectOnDefaultChange(event.entity as Partial<Account>);
  }

  applyEffectOnDefaultChange(payload: Partial<Account>) {
    if (payload?.isDefault) {
      this.mailerService.setDefaults(payload as Account);
    }
  }

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
