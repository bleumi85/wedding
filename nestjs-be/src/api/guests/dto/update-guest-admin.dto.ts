import { PartialType } from '@nestjs/swagger';
import { CreateGuestAdminDto } from './create-guest-admin.dto';

export class UpdateGuestAdminDto extends PartialType(CreateGuestAdminDto) {}
