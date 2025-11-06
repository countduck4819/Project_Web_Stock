import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enum/TypeEnum.enum';

export const ROLES_GUARD_KEY = Symbol('roles-guard');
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_GUARD_KEY, true);
