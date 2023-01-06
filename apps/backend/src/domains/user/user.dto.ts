import { OmitType, PartialType } from '@nestjs/swagger';
import { User } from './user.entity';

export class CreateUserDto extends OmitType(User, ['id']) {}

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['email', 'password']),
) {}
