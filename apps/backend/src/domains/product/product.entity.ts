import { isEmpty, isString, maxLength } from 'class-validator';
import { User } from '../user/user.entity';

export class Product {
  readonly id?: string;
  name: string;
  userId?: string;
  user: User;
  readonly createdAt?: Date | string;
  readonly updatedAt?: Date | string;

  constructor(props: Partial<Product> = {}) {
    const { id, name, user, userId, createdAt, updatedAt } = props;
    this.id = id;
    this.name = name;
    this.userId = userId;
    this.user = user;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export class ProductValidator {
  private product: Product;
  private MAX_NAME_LENGTH = 100 as const;
  private validationErrors: Partial<Record<keyof User, string | boolean>> = {};
  private forUpdate: boolean;

  constructor(
    product: Product,
    options: { forUpdate: boolean } = { forUpdate: false },
  ) {
    this.product = product;
    this.forUpdate = options.forUpdate;
    this.validateAll();
  }

  private validateName() {
    if (this.forUpdate && this.product.name === undefined) return true;
    if (isEmpty(this.product.name)) return 'Nama harus diisi';
    else if (!isString(this.product.name)) return 'Nama harus bertipe string';
    else if (!maxLength(this.product.name, this.MAX_NAME_LENGTH))
      return `Nama maksimal ${this.MAX_NAME_LENGTH} karakter`;
    return true;
  }

  validateAll() {
    const validationErrors = {
      name: this.validateName(),
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
