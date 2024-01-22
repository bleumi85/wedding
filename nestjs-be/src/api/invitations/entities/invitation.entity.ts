import { Address } from '@api/addresses/entities/address.entity';
import { File } from '@api/files/entities/file.entity';
import { Guest } from '@api/guests/entities/guest.entity';
import { DateEntity } from '@database';
import { Collection, Entity, OneToMany, OneToOne, Property } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ tableName: 'invitations' })
export class Invitation extends DateEntity {
  @Property({ defaultRaw: 'generate_token()' })
  @ApiProperty({ example: 'abcd-abcd-abcd' })
  public token: string;

  @Property({ hidden: true })
  public accessCode: string;

  @Property({ default: false })
  public isPrinted: boolean;

  @Property({ nullable: true, hidden: true })
  public currentHashedRefreshToken?: string;

  @OneToMany({ entity: () => Guest, mappedBy: 'invitation' })
  public guests = new Collection<Guest>(this);

  @OneToOne({ entity: () => Address, mappedBy: 'invitation' })
  public address: Address;

  @OneToOne({ entity: () => File, mappedBy: 'invitation', hidden: true })
  public file: File;

  @Property({ persist: false })
  get hasFile(): boolean {
    return !!this.file;
  }

  constructor(partial: Partial<Invitation>) {
    super();
    Object.assign(this, partial);
  }
}
