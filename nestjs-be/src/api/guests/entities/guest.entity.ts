import { Group } from '@api/groups/entities/group.entity';
import { Invitation } from '@api/invitations/entities/invitation.entity';
import { PrimaryEntity } from '@database';
import { Cascade, Collection, Entity, Enum, ManyToMany, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { AgeType, Gender, MealRequest, ResponseStatus, Role } from '@utils/enums';

@Entity({ tableName: 'guests' })
@Unique({ properties: ['firstName', 'lastName', 'invitation'], name: 'unique_full_name_on_invitation' })
export class Guest extends PrimaryEntity {
  @Property()
  @ApiProperty({ example: 'Ansgar' })
  public firstName: string;

  @Property()
  @ApiProperty({ example: 'Ragentor' })
  public lastName: string;

  @Property()
  @ApiProperty({ example: 'Onkel Ansgar' })
  public displayName: string;

  @Enum({
    items: () => ResponseStatus,
    customOrder: [ResponseStatus.OPEN, ResponseStatus.CONFIRMED, ResponseStatus.CANCELED],
    default: ResponseStatus.OPEN,
  })
  @ApiProperty({ enum: Object.keys(ResponseStatus) })
  public responseStatus: ResponseStatus;

  @Enum({
    items: () => Role,
    customOrder: [Role.ADMIN, Role.WITNESS, Role.GUEST],
    default: Role.GUEST,
  })
  @ApiProperty({ enum: Object.keys(Role) })
  public role: Role;

  @Enum({
    items: () => Gender,
    customOrder: [Gender.FEMALE, Gender.MALE],
  })
  @ApiProperty({ enum: Object.keys(Gender) })
  public gender: Gender;

  @Enum({
    items: () => AgeType,
    customOrder: [AgeType.ADULT, AgeType.CHILD],
    default: AgeType.ADULT,
  })
  @ApiProperty({ enum: Object.keys(AgeType) })
  public ageType: AgeType;

  @Enum({
    items: () => MealRequest,
    default: MealRequest.NONE,
  })
  @ApiProperty({ enum: Object.keys(MealRequest) })
  public mealRequest: MealRequest;

  @ManyToOne({ entity: () => Invitation, cascade: [Cascade.REMOVE] })
  public invitation: Invitation;

  @ManyToMany({
    entity: () => Group,
    mappedBy: 'guests',
    cascade: [Cascade.ALL],
  })
  public groups = new Collection<Group>(this);

  constructor(partial: Partial<Guest>) {
    super();
    Object.assign(this, partial);
  }
}
