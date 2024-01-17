import { Invitation } from '@api/invitations/entities/invitation.entity';
import { Request } from 'express';

export interface CookieToken {
  cookie: string;
  token: string;
}

export interface RequestWithCookies extends Request {
  cookies: {
    JblWeddingAccess: string;
    JblWeddingRefresh: string;
  };
}

export interface RequestWithInvitation extends Request {
  user: Invitation;
}

export interface TokenPayload {
  invitationId: string;
}
