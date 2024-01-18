import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Freunde der Braut' })
  groupName: string;

  @IsString()
  @IsOptional()
  @Matches(/^#[0-9a-f]{6}/, { message: 'colorLight muss ein valider Farcode sein' })
  @ApiProperty({ example: '#319795' })
  colorLight: string;

  @IsString()
  @IsOptional()
  @Matches(/^#[0-9a-f]{6}/, { message: 'colorDark muss ein valider Farcode sein' })
  @ApiProperty({ example: '#81e6d9' })
  colorDark: string;
}
