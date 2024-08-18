import { Column, Entity } from "typeorm";
import { BaseEntity } from "../common";

@Entity()
export class User extends BaseEntity {
  @Column({type: 'text', nullable: true})
  fullName?: string;

  @Column({type: 'text'})
  email: string;

  @Column({type: 'text'})
  password: string;
}
