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

    // Debug logging for production issues
    if (process.env.NODE_ENV === 'production') {
      console.log('🔍 JWT Guard Debug:', {
        url: request.url,
        method: request.method,
        hasCookie: !!request.cookies?.access_token,
        hasAuthHeader: !!request.headers.authorization,
        origin: request.headers.origin,
        userAgent: request.headers['user-agent']?.substring(0, 50)
      });
    }

    // Check for token in cookie first
    const tokenFromCookie = request.cookies?.access_token;
    if (tokenFromCookie) {
      request.headers.authorization = `Bearer ${tokenFromCookie}`;
      if (process.env.NODE_ENV === 'production') {
        console.log('🍪 Using token from cookie');
      }
    } else if (process.env.NODE_ENV === 'production') {
      console.log('🔍 No cookie token, using Authorization header');
    }

    return super.canActivate(context);
  }
}