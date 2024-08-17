import { getValue } from "express-ctx";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, DeleteDateColumn, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../user";

export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id?: string;

  @CreateDateColumn({ type: 'timestamptz', nullable: true })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamptz', nullable: true })
  updatedAt?: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt?: Date;
}

export class BaseEntityWithUser extends BaseEntity {
  @Column('text', { nullable: true, default: 'System' })
  createdBy?: string;

  @Column('text', { nullable: true, default: 'System' })
  updatedBy?: string;

  @BeforeInsert()
  updateCreatedBy?() {
    const user: User = getValue('user');
    this.createdBy = user.id;
  }

  @BeforeUpdate()
  updateUpdatedBy?() {
    const user: User = getValue('user');
    this.updatedBy = user.id;
  }

}
