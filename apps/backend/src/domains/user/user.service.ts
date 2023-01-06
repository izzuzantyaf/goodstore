import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { isEmpty, isNotEmpty } from 'class-validator';
import { CreateUserDto, UpdateUserDto } from 'src/domains/user/user.dto';
import { ErrorResponse } from 'src/lib/response.dto';
import { DataServiceService } from 'src/database/data-service.service';
import { User, UserValidator } from './user.entity';
import { bcrypt } from 'src/lib/bcrypt.helper';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private dataService: DataServiceService) {}

  async create(createUserDto: CreateUserDto) {
    this.logger.debug(
      `createUserDto ${JSON.stringify(createUserDto, undefined, 2)}`,
    );
    // validasi dulu data calon user
    const newUser = new User(createUserDto);
    const userValidation = new UserValidator(newUser);
    if (!userValidation.isAllPropsValid()) {
      this.logger.debug(
        `User data is not valid ${JSON.stringify(
          userValidation.getValidationErrors(),
          undefined,
          2,
        )}`,
      );
      this.logger.log(
        `User creation failed ${JSON.stringify({ name: createUserDto.name })}`,
      );
      throw new BadRequestException(
        new ErrorResponse({
          message: 'Data tidak valid',
          errors: userValidation.getValidationErrors(),
        }),
      );
    }
    // cek dulu apakah user sudah pernah register sebelumnya
    const existingUser = await this.dataService.user.findByEmail(newUser.email);
    if (isNotEmpty(existingUser)) {
      this.logger.log(
        `Email is already registered to user ${JSON.stringify({
          userId: existingUser.id,
        })}`,
      );
      this.logger.log(
        `User creation failed ${JSON.stringify({ name: createUserDto.name })}`,
      );
      throw new ConflictException(
        new ErrorResponse({ message: 'Email sudah terdaftar' }),
      );
    }
    // enkripsikan password user sebelum disimpan ke database
    newUser.password = bcrypt.hashSync(newUser.password, 10);
    // simpan user
    const storedUser = await this.dataService.user.create(newUser);
    this.logger.debug(
      `Stored user ${JSON.stringify(storedUser, undefined, 2)}`,
    );
    this.logger.log(
      `User created ${JSON.stringify({ userId: storedUser.id })}`,
    );
    return storedUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    this.logger.debug(
      `updateUserDto ${JSON.stringify(updateUserDto, undefined, 2)}`,
    );
    // validasi dulu data user
    const user = new User(updateUserDto);
    const userValidation = new UserValidator(user, { forUpdate: true });
    if (!userValidation.isAllPropsValid()) {
      this.logger.debug(
        `User data is not valid ${JSON.stringify(
          userValidation.getValidationErrors(),
          undefined,
          2,
        )}`,
      );
      this.logger.log(`User update failed ${JSON.stringify({ userId: id })}`);
      throw new BadRequestException(
        new ErrorResponse({
          message: 'Data user tidak valid',
          errors: userValidation.getValidationErrors(),
        }),
      );
    }
    // update user
    const updatedUser = await this.dataService.user.updateById(id, user);
    this.logger.debug(
      `Updated user ${JSON.stringify(updatedUser, undefined, 2)}`,
    );
    this.logger.log(`User updated ${JSON.stringify({ userId: user.id })}`);
    return updatedUser;
  }

  async delete(id: string) {
    const deletedUser = await this.dataService.user.deleteById(id);
    if (isEmpty(deletedUser)) {
      this.logger.log(
        `User deletion failed ${JSON.stringify({
          userId: id,
        })}`,
      );
      throw new BadRequestException(
        new ErrorResponse({ message: 'Akun gagal dihapus' }),
      );
    }
    this.logger.log(
      `User deleted ${JSON.stringify({ userId: deletedUser.id })}`,
    );
    return deletedUser;
  }

  async checkUserCredentials(email: string, password: string) {
    const user = await this.dataService.user.findByEmail(email);
    this.logger.debug(
      `User with email ${email} ${JSON.stringify(user, undefined, 2)}`,
    );
    if (isEmpty(user)) {
      this.logger.log('User credentials invalid');
      throw new UnauthorizedException(
        new ErrorResponse({ message: 'Login gagal' }),
      );
    }
    const isPasswordMatch = bcrypt.compareSync(password, user.password);
    this.logger.debug(
      `Password match ${JSON.stringify({ isPasswordMatch }, undefined, 2)}`,
    );
    if (!isPasswordMatch) {
      this.logger.log('User credentials invalid');
      throw new UnauthorizedException(
        new ErrorResponse({ message: 'Login gagal' }),
      );
    }
    return user;
  }
}
