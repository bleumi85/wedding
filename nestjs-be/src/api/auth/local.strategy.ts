import { Invitation } from '@api/invitations/entities/invitation.entity';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'token',
      passwordField: 'accessCode',
    });
  }

  async validate(token: string, accessCode: string): Promise<Invitation> {
    return this.authService.getAuthenticatedInvitation(token, accessCode, true);
  }
}
