import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateFileDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
