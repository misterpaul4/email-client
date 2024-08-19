import { Column, Entity, OneToOne } from "typeorm";
import { BaseEntity } from "../common";
import { Provider } from "../provider";

@Entity()
export class Account extends BaseEntity {
  @Column({type: 'text', nullable: true})
  fullName?: string;

  @Column({type: 'text'})
  email: string;

  @OneToOne(() => Provider, {cascade: true, onDelete: 'CASCADE'})
  provider: Provider
}
