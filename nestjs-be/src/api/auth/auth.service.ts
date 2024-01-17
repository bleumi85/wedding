import { InvitationsService } from '@api/invitations/invitations.service';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { CookieToken, TokenPayload } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly invitationsService: InvitationsService,
    private readonly jwtService: JwtService,
  ) {}

  public async getAuthenticatedInvitation(token: string, accessCode: string, showGuests = false) {
    try {
      const invitation = await this.invitationsService.findOneByToken(token, showGuests);
      await this.verifyAccessCode(accessCode, invitation.accessCode);
      return invitation;
    } catch (err) {
      Logger.error(err);
      throw new HttpException('Falsche Zugangsdaten', HttpStatus.UNAUTHORIZED);
    }
  }

  public getCookieWithToken(type: 'Access' | 'Refresh', invitationId: string): CookieToken {
    const payload: TokenPayload = { invitationId };
    const expTime = this.configService.get<number>(`jwt.${type.toLowerCase()}.expTime`);
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>(`jwt.${type.toLowerCase()}.secret`),
      expiresIn: `${expTime}s`,
    });
    const cookie = `JblWedding${type}=${token}; HttpOnly; Path=/; SameSite=Strict; Expires=${new Date(Date.now() + 1000 * expTime)}`;
    return { cookie, token };
  }

  public getCookiesForLogout() {
    return [`JblWeddingAccess=; HttpOnly; Path=/; Expires=${new Date(Date.now())}`, `JblWeddingRefresh=; HttpOnly; Path=/; Expires=${new Date(Date.now())}`];
  }

  private async verifyAccessCode(accessCode: string, accessCodeHash: string) {
    const isAccessCodeMatching = await bcrypt.compare(accessCode, accessCodeHash);
    if (!isAccessCodeMatching) {
      throw new HttpException('Der AccessCode ist falsch', HttpStatus.UNAUTHORIZED);
    }
  }
}
