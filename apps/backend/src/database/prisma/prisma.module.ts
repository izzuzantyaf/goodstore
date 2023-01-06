import { Module } from '@nestjs/common';
import { PrismaClientService } from './prisma-client.service';
import { PrismaService } from './prisma.service';
import { UserRepository } from '../../domains/user/user.repo';

@Module({
  providers: [PrismaClientService, PrismaService, UserRepository],
  exports: [UserRepository],
})
export class PrismaModule {}
