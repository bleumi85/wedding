import { Get, UseGuards } from '@nestjs/common';
import { ControllerHelper } from '@utils/controller-helper';
import { Role } from '@utils/enums';
import { InvitationsService } from './invitations.service';
import RoleGuard from './role.guard';

@ControllerHelper('invitations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Get()
  @UseGuards(RoleGuard([Role.ADMIN]))
  findAll() {
    return this.invitationsService.findAll();
  }
}
