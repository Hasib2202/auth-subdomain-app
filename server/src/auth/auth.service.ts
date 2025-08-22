// server/src/auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) { }

  async signup(createUserDto: CreateUserDto) {
    const { username, password, shopNames } = createUserDto;

    // Check if user exists
    const existingUser = await this.userService.findByUsername(username);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    // Check if any shop name already exists
    for (const shopName of shopNames) {
      const existingShop = await this.userService.findShopByName(shopName);
      if (existingShop) {
        throw new ConflictException(`Shop name "${shopName}" already exists`);
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with shops
    const user = await this.userService.create({
      username,
      password: hashedPassword,
      shopNames,
    });

    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '24h' }),
      user: { id: user.id, username: user.username },
    };
  }

  async login(loginDto: LoginDto) {
    const { username, password, rememberMe } = loginDto;

    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect password');
    }

    const expiresIn = rememberMe ? '7d' : '30m';
    const payload = { username: user.username, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload, { expiresIn }),
      user: { id: user.id, username: user.username },
      expiresIn,
    };
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return { id: user.id, username: user.username };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
