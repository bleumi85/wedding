import { ApiProperty } from '@nestjs/swagger';
import { AgeType, Gender } from '@utils/enums';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateIf, ValidateNested } from 'class-validator';

class AddressParam {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Schlossallee 123' })
  street: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Berlin' })
  city: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '12345' })
  zipCode: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Deutschland' })
  country: string;
}

class GuestParam {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Ansgar' })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Ragentor' })
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Onkel Ansgar' })
  displayName: string;

  @IsEnum(Gender)
  @ApiProperty({ enum: Object.keys(Gender) })
  gender: Gender;

  @IsEnum(AgeType)
  @ApiProperty({ enum: Object.keys(AgeType) })
  ageType: AgeType;

  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMinSize(1)
  @ApiProperty({ type: [String], example: ['4a2cdfa9-faf1-44fb-b92d-c1ef02f1a73d', '0c67ee49-35d7-419e-ad9e-465ad24aa4e2'] })
  groups: string[];
}

export class CreateInvitationDto {
  @IsString()
  @IsOptional()
  currentHashedRefreshToken?: string;

  @ValidateNested()
  @Type(() => AddressParam)
  @ValidateIf((_, value) => value !== null)
  @ApiProperty({ nullable: true })
  address: AddressParam | null;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => GuestParam)
  @ApiProperty({ type: GuestParam, isArray: true })
  guests: GuestParam[];
}
