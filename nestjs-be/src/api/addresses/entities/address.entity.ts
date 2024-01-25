import { Invitation } from '@api/invitations/entities/invitation.entity';
import { PrimaryEntity } from '@database';
import { Entity, OneToOne, Property } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ tableName: 'addresses' })
export class Address extends PrimaryEntity {
  @Property()
  @ApiProperty({ example: 'Schlossallee 123' })
  public street: string;

  @Property()
  @ApiProperty({ example: '12345' })
  public zipCode: string;

  @Property()
  @ApiProperty({ example: 'Berlin' })
  public city: string;

  @Property({ default: 'Deutschland' })
  @ApiProperty({ example: 'Deutschland' })
  public country: string;

  @OneToOne({
    entity: () => Invitation,
    mappedBy: 'address',
  })
  public invitation: Invitation;

  constructor(address: Partial<Address>) {
    super();
    Object.assign(this, address);
  }
}
