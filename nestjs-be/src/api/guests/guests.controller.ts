import { Body, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ControllerHelper } from '@utils/controller-helper';
import { GuestsService } from './guests.service';
import RoleGuard from '@api/invitations/role.guard';
import { Role } from '@utils/enums';
import { RequestWithInvitation } from '@api/auth/auth.types';
import { ApiBody } from '@nestjs/swagger';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { UpdateGuestAdminDto } from './dto/update-guest-admin.dto';

@ControllerHelper('guests')
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  @Get()
  @UseGuards(RoleGuard([Role.ADMIN]))
  findAll() {
    return this.guestsService.findAll();
  }

  @Get('common')
  @UseGuards(RoleGuard([Role.ADMIN, Role.WITNESS, Role.GUEST]))
  findAllFromCommonGroups(@Req() req: RequestWithInvitation) {
    const { user: invitation } = req;
    const guests = invitation.guests.map((guest) => guest);
    const hasAdmin = guests.some((guest) => guest.role === Role.ADMIN);
    return this.guestsService.findAllFromCommonGroups(invitation.id, hasAdmin);
  }

  @Get(':id')
  @UseGuards(RoleGuard([Role.ADMIN]))
  findOne(@Param('id') id: string) {
    return this.guestsService.findOne(id, true);
  }

  @Patch('admin/:id')
  @UseGuards(RoleGuard([Role.ADMIN]))
  @ApiBody({ type: UpdateGuestAdminDto })
  update(@Param('id') id: string, @Body() updateGuestDto: UpdateGuestAdminDto) {
    return this.guestsService.update(id, updateGuestDto);
  }

  @Patch()
  @UseGuards(RoleGuard([Role.ADMIN, Role.WITNESS, Role.GUEST]))
  @ApiBody({ type: UpdateGuestDto, isArray: true })
  updateBulk(@Body() updateGuestsDto: UpdateGuestDto[], @Req() req: RequestWithInvitation) {
    const { user: invitation } = req;
    const guests = invitation.guests.map((guest) => guest);
    const ids = invitation.guests.map((guest) => guest.id) as string[];
    const hasAdmin = guests.some((guest) => guest.role === Role.ADMIN);
    return this.guestsService.updateBulk(ids, updateGuestsDto, hasAdmin);
  }
}
