import { RequestWithInvitation } from '@api/auth/auth.types';
import { JwtAuthGuard } from '@api/auth/jwt-auth.guard';
import { Type, CanActivate, ExecutionContext, mixin } from '@nestjs/common';
import { Role } from '@utils/enums';

const RoleGuard = (roles: Role[]): Type<CanActivate> => {
  class RoleGuardMixin extends JwtAuthGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest<RequestWithInvitation>();
      const { user: invitation } = request;

      if (!roles) return true;

      const guestRoles = invitation.guests.map((guest) => guest.role);
      console.log({ roles, guestRoles, user: request.user });
      return roles.some((role) => guestRoles.includes(role));
    }
  }

  return mixin(RoleGuardMixin);
};

export default RoleGuard;
