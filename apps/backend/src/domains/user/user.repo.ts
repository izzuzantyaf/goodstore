import { Injectable, Logger } from '@nestjs/common';
import { PrismaClientService } from '../../database/prisma/prisma-client.service';
import { User } from 'src/domains/user/user.entity';
import { CreateUserDto, UpdateUserDto } from 'src/domains/user/user.dto';
import { isNotEmpty } from 'class-validator';

@Injectable()
export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(private prisma: PrismaClientService) {}

  async create(data: CreateUserDto): Promise<User> {
    const storedUser = await this.prisma.user.create({ data });
    return new User(storedUser as User);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return isNotEmpty(user) ? new User(user as User) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    let user;
    try {
      user = await this.prisma.user.findUnique({ where: { email } });
    } catch (error) {
      this.logger.debug(error);
    }
    return isNotEmpty(user) ? new User(user) : null;
  }

  async updateById(id: string, newUser: UpdateUserDto): Promise<User> {
    let updatedUser;
    try {
      updatedUser = await this.prisma.user.update({
        where: {
          id,
        },
        data: newUser,
      });
    } catch (error) {
      this.logger.debug(error);
    }
    return isNotEmpty(updatedUser) ? new User(updatedUser) : null;
  }

  async deleteById(id: string): Promise<User | null> {
    let deletedUser;
    try {
      deletedUser = await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.debug(error);
    }
    return isNotEmpty(deletedUser) ? new User(deletedUser) : null;
  }

  async deleteByEmail(email: string): Promise<User | null> {
    const deletedUser = await this.prisma.user.delete({ where: { email } });
    return isNotEmpty(deletedUser) ? new User(deletedUser as User) : null;
  }
}
