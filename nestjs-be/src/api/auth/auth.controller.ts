import { InvitationsService } from '@api/invitations/invitations.service';
import { HttpCode, HttpStatus, Post, UseGuards, Req, Res, Get } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { ControllerHelper } from '@utils/controller-helper';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RequestWithInvitation } from './auth.types';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtRefreshGuard } from './jwt-refresh.guard';

@ControllerHelper('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly invitationsService: InvitationsService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiBody({ type: LoginDto })
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: RequestWithInvitation, @Res({ passthrough: true }) res: Response) {
    const { user: invitation } = req;
    const { cookie: accessCookie } = this.authService.getCookieWithToken('Access', invitation.id);
    const { token: refreshToken, cookie: refreshCookie } = this.authService.getCookieWithToken('Refresh', invitation.id);

    await this.invitationsService.update(invitation.id, { currentHashedRefreshToken: refreshToken });

    res.setHeader('Set-Cookie', [accessCookie, refreshCookie]);

    return invitation;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: RequestWithInvitation) {
    await this.invitationsService.update(req.user.id, { currentHashedRefreshToken: null });
    req.res.setHeader('Set-Cookie', this.authService.getCookiesForLogout());
  }

  @Get('refresh')
  @UseGuards(JwtRefreshGuard)
  refresh(@Req() req: RequestWithInvitation) {
    const { user: invitation } = req;
    const { cookie: accessCookie } = this.authService.getCookieWithToken('Access', invitation.id);

    req.res.setHeader('Set-Cookie', accessCookie);
    return invitation;
  }
}
