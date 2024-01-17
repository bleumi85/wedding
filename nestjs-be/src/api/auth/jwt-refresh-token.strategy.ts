import { InvitationsService } from '@api/invitations/invitations.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RequestWithCookies, TokenPayload } from './auth.types';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(
    private readonly configService: ConfigService,
    private readonly invitationsService: InvitationsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: RequestWithCookies) => {
          return request.cookies.JblWeddingRefresh;
        },
      ]),
      secretOrKey: configService.get<string>('jwt.refresh.secret'),
      passReqToCallback: true,
    });
  }

  async validate(request: RequestWithCookies, payload: TokenPayload) {
    const refreshToken = request.cookies.JblWeddingRefresh;
    return this.invitationsService.getInvitationIfRefreshTokenMatches(refreshToken, payload.invitationId, true);
  }
}
