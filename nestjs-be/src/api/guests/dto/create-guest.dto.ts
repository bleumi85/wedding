import { ApiProperty } from '@nestjs/swagger';
import { AgeType, Gender, MealRequest, ResponseStatus, Role } from '@utils/enums';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateGuestDto {
  @IsUUID()
  @IsOptional()
  @ApiProperty({ required: false })
  id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Ansgar' })
  public firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Ragentor' })
  public lastName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Onkel Ansgar' })
  public displayName: string;

  @IsEnum(ResponseStatus)
  @ApiProperty({ enum: Object.keys(ResponseStatus) })
  responseStatus: ResponseStatus;

  @IsEnum(Role)
  @ApiProperty({ enum: Object.keys(Role) })
  role: Role;

  @IsEnum(Gender)
  @ApiProperty({ enum: Object.keys(Gender) })
  gender: Gender;

  @IsEnum(AgeType)
  @ApiProperty({ enum: Object.keys(AgeType) })
  ageType: AgeType;

  @IsEnum(MealRequest)
  @ApiProperty({ enum: Object.keys(MealRequest) })
  mealRequest: MealRequest;
}
