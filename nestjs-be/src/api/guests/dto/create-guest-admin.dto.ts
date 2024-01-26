import { ApiProperty } from '@nestjs/swagger';
import { MealRequest, ResponseStatus } from '@utils/enums';
import { ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateGuestAdminDto {
  @IsUUID()
  @IsOptional()
  @ApiProperty({ required: false })
  id: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  invitation: string;

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

  @IsEnum(MealRequest)
  @ApiProperty({ enum: Object.keys(MealRequest) })
  mealRequest: MealRequest;

  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMinSize(1)
  @ApiProperty({ type: [String], example: ['4a2cdfa9-faf1-44fb-b92d-c1ef02f1a73d', '0c67ee49-35d7-419e-ad9e-465ad24aa4e2'] })
  groups: string[];
}
