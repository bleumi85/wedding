import { Group } from '@api/groups/entities/group.entity';
import { Guest } from '@api/guests/entities/guest.entity';
import { Entity, ManyToOne } from '@mikro-orm/core';

@Entity({ tableName: 'groups_guests' })
export class GroupGuest {
  @ManyToOne({ primary: true, entity: () => Group })
  group: Group;

  @ManyToOne({ primary: true, entity: () => Guest })
  guest: Guest;
}
