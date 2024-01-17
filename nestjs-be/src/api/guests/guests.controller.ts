import { Get, UseGuards } from '@nestjs/common';
import { ControllerHelper } from '@utils/controller-helper';
import { GuestsService } from './guests.service';
import RoleGuard from '@api/invitations/role.guard';
import { Role } from '@utils/enums';

@ControllerHelper('guests')
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  @Get()
  @UseGuards(RoleGuard([Role.ADMIN]))
  findAll() {
    return this.guestsService.findAll();
  }
}
