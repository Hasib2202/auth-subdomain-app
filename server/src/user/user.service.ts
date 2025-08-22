// server/src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: { username: string; password: string; shopNames: string[] }) {
    return this.prisma.user.create({
      data: {
        username: data.username,
        password: data.password,
        shops: {
          create: data.shopNames.map(name => ({ name })),
        },
      },
      include: {
        shops: true,
      },
    });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
      include: { shops: true },
    });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { shops: true },
    });
  }

  async findShopByName(name: string) {
    return this.prisma.shop.findUnique({
      where: { name },
    });
  }
}