import { Body, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ControllerHelper } from '@utils/controller-helper';
import { Role } from '@utils/enums';
import { InvitationsService } from './invitations.service';
import RoleGuard from './role.guard';
import { CreateInvitationDto } from './dto/create-invitation.dto';

@ControllerHelper('invitations')
@UseGuards(RoleGuard([Role.ADMIN]))
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Post()
  create(@Body() createInvitationDto: CreateInvitationDto) {
    return this.invitationsService.create(createInvitationDto);
  }

  @Get()
  findAll() {
    return this.invitationsService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.invitationsService.remove(id);
  }
}
