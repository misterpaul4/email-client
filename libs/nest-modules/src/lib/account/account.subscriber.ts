import { Account } from '@entities';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { MailerService } from '../mailer';

@EventSubscriber()
export class AccountSubscriber implements EntitySubscriberInterface<Account> {
  constructor(private mailerService: MailerService) {}
  beforeInsert(event: InsertEvent<Account>): Promise<any> | void {
    this.applyEffectOnDefaultChange(event.entity);
  }

  beforeUpdate(event: UpdateEvent<Account>): Promise<any> | void {
    this.applyEffectOnDefaultChange(event.entity as Partial<Account>);
  }

  applyEffectOnDefaultChange(payload: Partial<Account>) {
    if (payload?.isDefault) {
      this.mailerService.setDefaults(payload as Account);
    }
  }
}
