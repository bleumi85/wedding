import { Role } from '@utils/enums';
import RoleGuard from './role.guard';

describe('RoleGuard', () => {
  it('should be defined', () => {
    expect(RoleGuard([Role.ADMIN])).toBeDefined();
  });
});
