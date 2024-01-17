import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsString, Matches } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^([a-z0-9]{12}|[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4})$/, { message: 'Token muss vom Typ "abcd-abcd-abcd" sein' })
  @ApiProperty()
  readonly token: string;

  @IsNumberString()
  @IsNotEmpty()
  @ApiProperty()
  readonly accessCode: string;
}
