import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      roundsOfHashing,
    );
    createUserDto.password = hashedPassword;
    const data: Prisma.UserCreateInput = createUserDto;
    return this.prisma.user.create({ data });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    const where: Prisma.UserWhereUniqueInput = { id };
    return this.prisma.user.findUnique({ where });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        roundsOfHashing,
      );
    }

    const args: Prisma.UserUpdateArgs = {
      where: { id },
      data: updateUserDto,
    };
    return this.prisma.user.update(args);
  }

  remove(id: number) {
    const where: Prisma.UserWhereUniqueInput = { id };
    return this.prisma.user.delete({ where });
  }
}
