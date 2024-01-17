import { Guest } from '@api/guests/entities/guest.entity';
import { DateEntity } from '@database';
import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ tableName: 'invitations' })
export class Invitation extends DateEntity {
  @Property()
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

  constructor(partial: Partial<Invitation>) {
    super();
    Object.assign(this, partial);
  }
}
