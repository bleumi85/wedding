import { Invitation } from '@api/invitations/entities/invitation.entity';
import { PrimaryEntity } from '@database';
import { Cascade, Entity, OneToOne, Property } from '@mikro-orm/core';

@Entity({ tableName: 'files' })
export class File extends PrimaryEntity {
  @Property()
  public fileName: string;

  @Property()
  public filePath: string;

  @Property()
  public mimeType: string;

  @Property({ type: 'bigint' })
  public size: number;

  @Property({ type: 'bool', default: false })
  public isSend: boolean;

  @OneToOne({
    entity: () => Invitation,
    inversedBy: 'file',
    owner: true,
    cascade: [Cascade.ALL],
  })
  public invitation: Invitation;

  constructor(file: Partial<File>) {
    super();
    Object.assign(this, file);
  }
}
