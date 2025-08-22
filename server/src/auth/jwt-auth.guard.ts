// server/src/auth/jwt-auth.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    
    // Check for token in cookie first
    const tokenFromCookie = request.cookies?.access_token;
    if (tokenFromCookie) {
      request.headers.authorization = `Bearer ${tokenFromCookie}`;
    }
    
    return super.canActivate(context);
  }
}