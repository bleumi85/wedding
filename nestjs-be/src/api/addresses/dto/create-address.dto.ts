import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @IsOptional()
  @IsUUID()
  @ApiProperty()
  id?: string;

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

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  invitation: string;
}
