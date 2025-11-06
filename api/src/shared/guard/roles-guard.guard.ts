import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_GUARD_KEY } from '../decorator/roles.decorator';
import { AccountType, UserRole } from '../enum/TypeEnum.enum';
import { IS_PUBLIC_KEY } from '../decorator/is-public.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const roles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_GUARD_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!roles || roles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user) throw new ForbiddenException('Bạn cần đăng nhập');

    // Admin luôn pass
    if (user.role === UserRole.ADMIN) return true;

    // User premium pass
    if (user.role === UserRole.USER && user.accountType === AccountType.PREMIUM)
      return true;

    // User free / normal pass (nếu muốn)
    if (
      user.role === UserRole.USER ||
      (user.role === UserRole.USER && user.accountType === AccountType.FREE)
    )
      return true;

    throw new ForbiddenException(
      'Chỉ admin hoặc user premium/free mới được truy cập',
    );
  }
}
