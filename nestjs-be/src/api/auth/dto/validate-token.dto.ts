import { ApiProperty } from '@nestjs/swagger';
import { TOKEN_PATTERN } from '@utils/constants';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class ValidateTokenDto {
  @IsString({ message: 'token muss ein string sein' })
  @IsNotEmpty({ message: 'token darf nicht leer sein' })
  @Matches(TOKEN_PATTERN, { message: "token muss im Format 'abcd-abcd-abcd' sein" })
  @ApiProperty()
  readonly token: string;
}
