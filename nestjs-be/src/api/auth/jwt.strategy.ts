import { InvitationsService } from '@api/invitations/invitations.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RequestWithCookies, TokenPayload } from './auth.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly invitationsService: InvitationsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: RequestWithCookies) => {
          return request?.cookies?.JblWeddingAccess;
        },
      ]),
      secretOrKey: configService.get<string>('jwt.access.secret'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: TokenPayload) {
    return this.invitationsService.findOne(payload.invitationId, true);
  }
}
