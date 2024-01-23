import { Body, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { ControllerHelper } from '@utils/controller-helper';
import { GuestsService } from './guests.service';
import RoleGuard from '@api/invitations/role.guard';
import { Role } from '@utils/enums';
import { RequestWithInvitation } from '@api/auth/auth.types';
import { ApiBody } from '@nestjs/swagger';
import { UpdateGuestDto } from './dto/update-guest.dto';

@ControllerHelper('guests')
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  @Get()
  @UseGuards(RoleGuard([Role.ADMIN]))
  findAll() {
    return this.guestsService.findAll();
  }

  @Patch()
  @UseGuards(RoleGuard([Role.ADMIN, Role.WITNESS, Role.GUEST]))
  @ApiBody({ type: UpdateGuestDto, isArray: true })
  update(@Body() updateGuestsDto: UpdateGuestDto[], @Req() req: RequestWithInvitation) {
    const { user: invitation } = req;
    const guests = invitation.guests.map((guest) => guest);
    const ids = invitation.guests.map((guest) => guest.id) as string[];
    const hasAdmin = guests.some((guest) => guest.role === Role.ADMIN);
    return this.guestsService.update(ids, updateGuestsDto, hasAdmin);
  }
}
