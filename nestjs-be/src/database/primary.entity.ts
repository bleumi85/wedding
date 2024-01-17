import { Entity, PrimaryKey } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

@Entity({ abstract: true })
export abstract class PrimaryEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  public id = uuid();
}
