import { Module } from '@nestjs/common';
import { PrismaClientService } from './prisma-client.service';
import { PrismaService } from './prisma.service';
import { UserRepository } from '../../domains/user/user.repo';
import { ProductRepository } from 'src/domains/product/product.repo';

@Module({
  providers: [
    PrismaClientService,
    PrismaService,
    UserRepository,
    ProductRepository,
  ],
  exports: [UserRepository, ProductRepository],
})
export class PrismaModule {}
