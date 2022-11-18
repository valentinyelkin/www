import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../../common/enums/roles.enum';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { AuthService } from '../auth.service';
import { MoreThan } from 'typeorm';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    const userById = await this.authService.usersRepository.find({
      where: {
        email: user.email,
      },
    });

    return requiredRoles.some((role) => userById[0]?.role?.includes(role));
  }
}
