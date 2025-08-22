// server/src/user/user.controller.ts
import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req) {
    const user = await this.userService.findById(req.user.id);
    return {
      id: user.id,
      username: user.username,
      shops: user.shops.map(shop => shop.name),
    };
  }
}