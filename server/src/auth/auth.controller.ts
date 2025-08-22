// server/src/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Get, Req, Res, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.signup(createUserDto);
    
    // Set HTTP-only cookie
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      domain: '.localhost',
    });

    return result;
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(loginDto);
    
    const maxAge = loginDto.rememberMe 
      ? 7 * 24 * 60 * 60 * 1000 // 7 days
      : 30 * 60 * 1000; // 30 minutes

    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge,
      domain: '.localhost',
    });

    return result;
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', { domain: '.localhost' });
    return { message: 'Logged out successfully' };
  }

  @Get('validate')
  @UseGuards(JwtAuthGuard)
  async validate(@Req() req) {
    return { user: req.user };
  }
}