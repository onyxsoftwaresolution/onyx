import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_ANONYMOUS } from '../rbac/anonymous.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isAnonymous = this.reflector.getAllAndOverride<boolean>(
      IS_ANONYMOUS,
      [context.getHandler(), context.getClass()],
    );
    if (isAnonymous) {
      return true;
    }
    return super.canActivate(context);
  }
}
