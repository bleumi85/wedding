import { ApiProperty } from '@nestjs/swagger';
import { AgeType, Gender } from '@utils/enums';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, Matches, ValidateIf, ValidateNested } from 'class-validator';

class AddressParam {
  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @IsString()
  @IsNotEmpty()
  country: string;
}

class GuestParam {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  otherName: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsEnum(AgeType)
  ageType: AgeType;

  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMinSize(1)
  groups: string[];
}

export class CreateInvitationDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^([a-z0-9]{12}|[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4})$/, { message: 'Token muss vom Typ "abcd-abcd-abcd" sein' })
  @ApiProperty()
  token: string;

  @IsString()
  @IsOptional()
  currentHashedRefreshToken?: string;

  @ValidateNested()
  @Type(() => AddressParam)
  @ValidateIf((_, value) => value !== null)
  address: AddressParam | null;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => GuestParam)
  guests: GuestParam[];
}
