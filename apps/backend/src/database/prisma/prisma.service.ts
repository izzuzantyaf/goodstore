import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domains/user/user.repo';

@Injectable()
export class PrismaService {
  constructor(public user: UserRepository) {}
}
