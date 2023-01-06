import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { SuccessfulResponse } from 'src/lib/response.dto';
import { UserModule } from 'src/domains/user/user.module';
import { User } from 'src/domains/user/user.entity';
import { faker } from '@faker-js/faker';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { Gender } from 'src/lib/constants';

function createFakeUser(): User {
  const gender = Math.random() > 0.5 ? Gender.FEMALE : Gender.MALE;
  return {
    name: faker.name.fullName({ sex: gender }),
    email: faker.internet.email(),
    password: 'helloworld',
    gender,
  };
}

describe('UserController', () => {
  let controller: UserController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();
    controller = module.get(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    const fakeUser = createFakeUser();
    it(`should return object instance of ${SuccessfulResponse.name} and created user`, async () => {
      const response = await controller.create(fakeUser);
      expect(response).toBeInstanceOf(SuccessfulResponse);
      expect(response.data).toBeInstanceOf(User);
    });
    it(`should throw ${BadRequestException.name} because name is empty`, async () => {
      await expect(
        controller.create({
          ...fakeUser,
          name: null,
        }),
      ).rejects.toThrow(BadRequestException);
    });
    it(`should throw ${BadRequestException.name} because name is not string`, async () => {
      await expect(
        controller.create({
          ...fakeUser,
          name: 123 as unknown as string,
        }),
      ).rejects.toThrow(BadRequestException);
    });
    it(`should throw ${BadRequestException.name} because name exeeds max character`, async () => {
      await expect(
        controller.create({
          ...fakeUser,
          name: 'namenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamename',
        }),
      ).rejects.toThrow(BadRequestException);
    });
    it(`should throw ${BadRequestException.name} because email is empty`, async () => {
      await expect(
        controller.create({ ...fakeUser, email: null }),
      ).rejects.toThrow(BadRequestException);
    });
    it(`should throw ${BadRequestException.name} because email is not string`, async () => {
      await expect(
        controller.create({ ...fakeUser, email: 1234556 as unknown as string }),
      ).rejects.toThrow(BadRequestException);
    });
    it(`should throw ${BadRequestException.name} because email is not email`, async () => {
      await expect(
        controller.create({
          ...fakeUser,
          email: 'this is not email',
        }),
      ).rejects.toThrow(BadRequestException);
    });
    it(`should throw ${BadRequestException.name} because password is empty`, async () => {
      await expect(
        controller.create({ ...fakeUser, password: null }),
      ).rejects.toThrow(BadRequestException);
    });
    it(`should throw ${BadRequestException.name} because password is not string`, async () => {
      await expect(
        controller.create({
          ...fakeUser,
          password: 12345 as unknown as string,
        }),
      ).rejects.toThrow(BadRequestException);
    });
    it(`should throw ${BadRequestException.name} because password length doesn't meet the mininum character`, async () => {
      await expect(
        controller.create({
          ...fakeUser,
          password: 'pass',
        }),
      ).rejects.toThrow(BadRequestException);
    });
    it(`should throw ${ConflictException.name} because email is already registered`, async () => {
      await expect(controller.create(fakeUser)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('update()', () => {
    let storedUser: User;
    beforeAll(async () => {
      const fakeUser = createFakeUser();
      storedUser = (await controller.create(fakeUser)).data;
    });
    it(`should return object instance of ${SuccessfulResponse.name} and updated user`, async () => {
      const modifiedUser = { ...storedUser, name: faker.name.fullName() };
      const result = await controller.update(storedUser.id, {
        ...modifiedUser,
      });
      expect(result).toBeInstanceOf(SuccessfulResponse);
      expect(result.data.name).toEqual(modifiedUser.name);
    });
    it(`should throw ${BadRequestException.name} because name is not string`, async () => {
      await expect(
        controller.update(storedUser.id, {
          ...storedUser,
          name: 123 as unknown as string,
        }),
      ).rejects.toThrow(BadRequestException);
    });
    it(`should throw ${BadRequestException.name} because name is empty`, async () => {
      await expect(
        controller.update(storedUser.id, {
          ...storedUser,
          name: '',
        }),
      ).rejects.toThrow(BadRequestException);
    });
    it(`should throw ${BadRequestException.name} because name exeeds max character`, async () => {
      await expect(
        controller.update(storedUser.id, {
          ...storedUser,
          name: 'namenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamename',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('delete()', () => {
    let userId: string | number;
    beforeAll(async () => {
      const storedfakeUser = (await controller.create(createFakeUser()))
        .data as User;
      userId = storedfakeUser.id;
    });
    it(`should return object instance of ${SuccessfulResponse.name}`, async () => {
      const response = await controller.delete(userId as string);
      expect(response).toBeInstanceOf(SuccessfulResponse);
    });
    it(`should throw ${BadRequestException.name} because the id is not valid`, async () => {
      await expect(controller.delete('not a valid id')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
