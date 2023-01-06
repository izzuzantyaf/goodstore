import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto } from 'src/domains/user/user.dto';
import { SuccessfulResponse } from 'src/lib/response.dto';
import { UserService } from 'src/domains/user/user.service';
import { Logger } from '@nestjs/common/services';
import { Patch } from '@nestjs/common/decorators';

@ApiTags('user')
@Controller('api/users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const storedUser = await this.userService.create(createUserDto);
    return new SuccessfulResponse({
      message: 'Registrasi berhasil',
      data: storedUser,
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userService.update(id, updateUserDto);
    return new SuccessfulResponse({
      message: 'Profil berhasil diupdate',
      data: updatedUser,
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.userService.delete(id);
    return new SuccessfulResponse({ message: 'Akun berhasil dihapus' });
  }
}
