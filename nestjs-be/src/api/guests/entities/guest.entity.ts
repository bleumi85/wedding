import { PrimaryEntity } from '@database';
import { Entity, Enum, Property } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { AgeType, Gender, MealRequest, ResponseStatus, Role } from '@utils/enums';

@Entity({ tableName: 'guests' })
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

  constructor(partial: Partial<Guest>) {
    super();
    Object.assign(this, partial);
  }
}
