import { Column, Entity } from "typeorm";
import { BaseEntity } from "../base-entity";

@Entity()
export class User extends BaseEntity {
  @Column({ type: "text" })
  fullName: string;

  @Column({ type: "text", unique: true })
  email: string;

  @Column({ type: "text", nullable: true })
  password?: string;
}
