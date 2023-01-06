import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domains/user/user.repo';
import { ProductRepository } from 'src/domains/product/product.repo';

@Injectable()
export class PrismaService {
  constructor(public user: UserRepository, public product: ProductRepository) {}
}
