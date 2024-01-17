import { Entity, Property } from '@mikro-orm/core';
import { PrimaryEntity } from './primary.entity';

@Entity({ abstract: true })
export abstract class DateEntity extends PrimaryEntity {
  @Property({
    type: 'timestamptz',
    defaultRaw: 'current_timestamp',
    hidden: true,
  })
  public createdAt: Date = new Date();

  @Property({
    type: 'timestamptz',
    onUpdate: () => new Date(),
    nullable: true,
  })
  updatedAt: Date | null;
}
