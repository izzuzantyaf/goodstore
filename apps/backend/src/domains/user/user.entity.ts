import {
  isEmail,
  isEmpty,
  isEnum,
  isString,
  maxLength,
  minLength,
} from 'class-validator';
import { Gender } from 'src/lib/constants';
import { Product } from '../product/product.entity';

/**
 * @description Class yang merepresentasikan data user pada database
 */
export class User {
  readonly id?: string;
  name: string;
  email: string;
  gender: Gender;
  password: string;
  readonly createdAt?: Date | string;
  readonly updatedAt?: Date | string;
  products?: Product[];

  constructor(props: Partial<User> = {}) {
    const {
      id,
      name,
      email,
      password,
      gender,
      products,
      createdAt,
      updatedAt,
    } = props;
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.gender = gender;
    this.products = products;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export class UserValidator {
  private user: User;
  private MAX_NAME_LENGTH = 100 as const;
  private MIN_PASSWORD_LENGTH = 6 as const;
  private validationErrors: Partial<Record<keyof User, string | boolean>> = {};
  private forUpdate: boolean;

  constructor(
    user: User,
    options: { forUpdate: boolean } = { forUpdate: false },
  ) {
    this.user = user;
    this.forUpdate = options.forUpdate;
    this.validateAll();
  }

  private validateName() {
    if (this.forUpdate && this.user.name === undefined) return true;
    if (isEmpty(this.user.name)) return 'Nama harus diisi';
    else if (!isString(this.user.name)) return 'Nama harus bertipe string';
    else if (!maxLength(this.user.name, this.MAX_NAME_LENGTH))
      return `Nama maksimal ${this.MAX_NAME_LENGTH} karakter`;
    return true;
  }

  private validateEmail() {
    if (this.forUpdate && this.user.email === undefined) return true;
    if (isEmpty(this.user.email)) return 'Email harus diisi';
    else if (!isString(this.user.email)) return 'Email harus bertipe string';
    else if (!isEmail(this.user.email)) return 'Email tidak valid';
    return true;
  }

  private validatePassword() {
    if (this.forUpdate && this.user.password === undefined) return true;
    if (isEmpty(this.user.password)) return 'Password harus diisi';
    else if (!isString(this.user.password))
      return 'Password harus bertipe string';
    else if (!minLength(this.user.password, this.MIN_PASSWORD_LENGTH))
      return `Password minimal ${this.MIN_PASSWORD_LENGTH} karakter`;
    return true;
  }

  private validateGender() {
    if (this.forUpdate && this.user.gender === undefined) return true;
    if (isEmpty(this.user.gender)) return 'Jenis kelamin harus diisi';
    else if (!isEnum(this.user.gender, Gender))
      return 'Jenis kelamin tidak valid';
    return true;
  }

  validateAll() {
    const validationErrors = {
      name: this.validateName(),
      email: this.validateEmail(),
      password: this.validatePassword(),
      gender: this.validateGender(),
    };
    this.validationErrors = validationErrors;

    return this.validationErrors;
  }

  getValidationErrors() {
    return this.validationErrors;
  }

  isAllPropsValid() {
    return Object.values(this.validationErrors).every(
      (validationError) => validationError === true,
    );
  }
}
