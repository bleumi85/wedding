import { Guest } from '@api/guests/entities/guest.entity';
import { GroupGuest } from '@api/relations/group-guest.entity';
import { PrimaryEntity } from '@database';
import { Cascade, Collection, Entity, ManyToMany, Property } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ tableName: 'groups' })
export class Group extends PrimaryEntity {
  @Property({ unique: true })
  @ApiProperty({ example: 'Brautpaar' })
  public groupName: string;

  @Property({ nullable: true })
  @ApiProperty({ example: '#ffaa45' })
  public colorLight?: string;

  @Property({ nullable: true })
  @ApiProperty({ example: '#ffaa45' })
  public colorDark?: string;

  @ManyToMany({
    entity: () => Guest,
    pivotEntity: () => GroupGuest,
    inversedBy: 'groups',
    owner: true,
    orderBy: { lastName: 'ASC', firstName: 'ASC' },
    cascade: [Cascade.ALL],
  })
  public guests = new Collection<Guest>(this);
}
